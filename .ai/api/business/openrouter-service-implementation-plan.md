# OpenRouterService – Implementation Plan

## 1. Service description

The OpenRouter service integrates communication with the LLM model via the OpenRouter API. The main purpose of this service is to enable automatic response generation based on a combination of system and user messages, while processing structured responses in JSON format.

## 2. Constructor description

The service constructor should:
- Initiate API configuration (API key, URL base, etc.).
- Set default model parameters (temperature, top_p, frequency_penalty, presence_penalty).
- Allow configuration of the system message (role: “system”) and user (role: “user”).
- Accept optional initialisation parameters (e.g. timeout, retries).

## 3. Public methods and fields

Main elements of the public interface:
-**sendChatMessage(userMessage: string): Promise<ResponseType>**
 - Sends a user message to the API, taking into account the previously set system message and model configuration.
-**setSystemMessage (message: string): void**
 - Allows you to set a system message.
- **setUserMessage (message: string): void**
 - Allows you to set a user message.
- **setResponseFormat (schema: JSONSchema): void**
 - Configures the JSON schema for structured responses (response_format).
- **setModel (name: string, parameters: ModelParameters): void**
 - Allows you to select a model (model: [model-name]) and set its parameters (temperature, top_p, frequency_penalty, presence_penalty) 
- Public configuration fields such as `apiUrl`, `apiKey`, and default model settings.

## 4. Private methods and fields

Key internal components:
- **executeRequest(requestPayload: RequestPayload): Promise<ApiResponse>**
 - Executes an HTTP call to the OpenRouter API, manages retries and parses responses. 
- **buildRequestPayload(): RequestPayload**
 - Builds a request payload containing:
  - System message, e.g.
    ```json { ‘role’: ‘system’, “content”: ‘[system-message]’ }```
  - User message, e.g.
    ```json {‘role’: ‘user’, “content”: ‘[user-message]’ }```
  - Structured output using response_format (JSON schema).
  - Model name and model parameters.
  - Private fields storing the current configuration: `currentSystemMessage`, `currentModelParameters`, `currentUserMessage`, `currentResponseFormat`, `currentModelName`

## 5. Error handling

Error handling should include:
- API response validation - checking the compliance of the received JSON with the expected schema.
- Handling network errors (e.g. timeout, no connection) and implementing a retry mechanism with backoff.
- Throwing specific exceptions for authentication errors (e.g. incorrect API key) and exceeding API limits.
- Logging errors with respect to safety rules (not registering confidential data)

## 6. Security considerations

In terms of security, attention should be paid to:
- Storing API keys in environment variables.
- Restricting the logging of sensitive data and avoiding storing full payloads containing API keys.

## 7. Step-by-step implementation plan

1. **Requirements analysis and project configuration**
 - Familiarise yourself with the OpenRouter API documentation.
 - Ensure that all dependencies (Astro, TypeScript, React, Tailwind, Shadcn/ui) are correctly configured.
2. **Implementation of the API client module**
 - Create a module (e.g. “src/lib/openrouter.ts”) dedicated to communication with the OpenRouter API.
 - Implement functions to set system and user messages and configure model parameters.
 - Implement the `executeRequest()` method to handle HTTP calls with a retry and backoff mechanism.
3. **Implementation of the chat logic layer**
 - Create a public interface for sending chat messages, consolidating the configuration of messages and model parameters.
 - Enable dynamic modification of the configuration (e.g. changing the system message in real time).
4. **Handling structured API responses**
 - Implement the `buildRequestPayload()` method, which creates the appropriate payload with the system message, user message, and specifies the response format (response_format).
 - Implement functions that validate and parse responses from the API.
5. **Implementation of error handling and logging**
 - Implement detailed exception handling for various scenarios (network error, authentication error, incorrect response structure). 
 - Add error logging mechanisms, keeping in mind security rules and not logging sensitive data.
