import { z } from "zod";
import type { ModelParameters, RequestPayload, ApiResponse } from "./openrouter.types";
import { OpenRouterError } from "./openrouter.types";
import { apiResponseSchema, modelParametersSchema, configSchema } from "./openrouter.schema";

export class OpenRouterService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private currentSystemMessage: string;
  private currentUserMessage: string;
  private currentModelName: string;
  private currentModelParameters: ModelParameters;
  private currentResponseFormat?: Record<string, unknown>;

  private readonly maxRetries: number;
  private readonly timeout: number;

  constructor(apiKey: string, options: z.input<typeof configSchema> = {}) {
    if (!apiKey) {
      throw new OpenRouterError("API key is required", "MISSING_API_KEY");
    }

    try {
      const validatedConfig = configSchema.parse(options);
      this.apiKey = apiKey;
      this.apiUrl = validatedConfig.apiUrl;
      this.currentSystemMessage = validatedConfig.systemMessage;
      this.currentModelName = validatedConfig.modelName;
      this.currentModelParameters = validatedConfig.modelParameters || {
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
      };
      this.timeout = validatedConfig.timeout;
      this.maxRetries = validatedConfig.maxRetries;
      this.currentUserMessage = "";
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new OpenRouterError(
          "Invalid configuration: " +
            error.errors.map((e: z.ZodError["errors"][number]) => `${e.path.join(".")}: ${e.message}`).join(", "),
          "INVALID_CONFIG",
          undefined,
          error
        );
      }
      throw error;
    }
  }

  /**
   * Sends a chat message to the OpenRouter API
   * @param userMessage The message to send
   * @returns Promise with the API response
   */
  public async sendChatMessage(userMessage: string): Promise<ApiResponse> {
    this.setUserMessage(userMessage);
    const payload = this.buildRequestPayload();
    return this.executeRequest(payload);
  }

  /**
   * Sets the system message for the chat
   * @param message The system message to set
   */
  public setSystemMessage(message: string): void {
    this.currentSystemMessage = message;
  }

  /**
   * Sets the user message for the chat
   * @param message The user message to set
   */
  public setUserMessage(message: string): void {
    this.currentUserMessage = message;
  }

  /**
   * Sets the response format schema for structured responses
   * @param schema The JSON schema to use for response formatting
   */
  public setResponseFormat(schema: Record<string, unknown>): void {
    try {
      JSON.stringify(schema);
      this.currentResponseFormat = schema;
    } catch (error) {
      throw new OpenRouterError("Invalid response format schema", "INVALID_RESPONSE_FORMAT_SCHEMA");
    }
  }

  /**
   * Sets the model and its parameters
   * @param name The model name to use
   * @param parameters The model parameters to use
   */
  public setModel(name: string, parameters?: ModelParameters): void {
    if (!name) {
      throw new OpenRouterError("Model name is required", "INVALID_MODEL_NAME");
    }

    this.currentModelName = name;

    if (parameters) {
      const validatedParams = modelParametersSchema.parse(parameters);
      this.currentModelParameters = validatedParams;
    }
  }

  /**
   * Builds the request payload for the OpenRouter API
   * @returns The request payload
   */
  private buildRequestPayload(): RequestPayload {
    const messages: { role: "system" | "user"; content: string }[] = [];

    if (this.currentSystemMessage) {
      messages.push({
        role: "system",
        content: this.currentSystemMessage,
      });
    }

    messages.push({
      role: "user",
      content: this.currentUserMessage,
    });

    const payload: RequestPayload = {
      messages,
      model: this.currentModelName,
      ...this.currentModelParameters,
    };

    if (this.currentResponseFormat) {
      payload.response_format = {
        type: "json_schema",
        json_schema: this.currentResponseFormat,
      };
    }

    return payload;
  }

  /**
   * Executes a request to the OpenRouter API with retry mechanism
   * @param requestPayload The payload to send
   * @returns Promise with the API response
   */
  private async executeRequest(requestPayload: RequestPayload): Promise<ApiResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.apiUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(requestPayload),
          signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new OpenRouterError(
            errorData.message || `HTTP error ${response.status}`,
            "API_ERROR",
            response.status,
            errorData
          );
        }

        const data = await response.json();
        const validatedResponse = apiResponseSchema.parse(data);
        return validatedResponse;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (error instanceof OpenRouterError) {
          // Don't retry client errors (4xx)
          if (error.status && error.status < 500) {
            throw error;
          }
        }

        // If this was the last attempt, throw the error
        if (attempt === this.maxRetries - 1) {
          throw new OpenRouterError(
            "Failed to execute request after multiple retries",
            "MAX_RETRIES_EXCEEDED",
            undefined,
            lastError
          );
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    // This should never happen due to the throw in the loop
    throw lastError || new Error("Unknown error");
  }
}
