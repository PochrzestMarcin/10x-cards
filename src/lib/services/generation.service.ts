import type { SupabaseClient } from '../../db/supabase.client';
import type { GenerationCreateResponseDto, FlashcardProposalDto } from '../../types';
import { createHash } from 'crypto';
import { OpenRouterService } from './openrouter.service';

export class GenerationService {
  private readonly openRouter: OpenRouterService;
  private readonly defaultModel = 'google/gemma-3n-e2b-it:free';

  constructor(
    private readonly supabase: SupabaseClient,
    openRouterApiKey: string
  ) {
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key is required');
    }

    this.openRouter = new OpenRouterService(openRouterApiKey, {
      modelName: this.defaultModel,
      systemMessage: this.getSystemPrompt(),
      modelParameters: {
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      maxRetries: 3,
      timeout: 60000 // 60 seconds
    });

    this.openRouter.setResponseFormat({
      type: "array",
      items: {
        type: "object",
        properties: {
          front: { type: "string"},
          back: { type: "string"},
        },
        required: ["front", "back"]
      },
    });
  }

  private getSystemPrompt(): string {
    return `You are a helpful AI assistant that creates high-quality flashcards from provided text.
Your task is to analyze the text and create concise, effective flashcards that help users learn the material.

Guidelines for creating flashcards:
1. Front side should be a clear, specific question or prompt (max 200 characters)
2. Back side should contain a concise, complete answer (max 500 characters)
3. Each flashcard should focus on a single concept or fact
4. Avoid overly complex or compound questions
5. Use clear, simple language
6. Ensure accuracy and maintain original meaning

Format your response as a JSON object with an array of flashcards, each containing 'front' and 'back' fields.
Example:
{
  "flashcards": [
    {
      "front": "What is the capital of France?",
      "back": "Paris"
    }
  ]
}`;
  }

  async generateFlashcards(
    sourceText: string,
    userId: string
  ): Promise<GenerationCreateResponseDto> {
    const startTime = Date.now();

    try {
      // Hash the source text for storage
      const sourceTextHash = createHash('md5')
        .update(sourceText)
        .digest('hex');

      // Generate flashcards using OpenRouter
      const response = await this.openRouter.sendChatMessage(sourceText);
      
      if (!response.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from OpenRouter: missing content');
      }

      // Parse the JSON response
      const content = response.choices[0].message.content;
      let parsedContent: { flashcards: { front: string; back: string }[] };
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        throw new Error('Invalid JSON response from OpenRouter');
      }

      // Convert to FlashcardProposalDto format
      const flashcards: FlashcardProposalDto[] = parsedContent.flashcards.map(card => ({
        front: card.front,
        back: card.back,
        source: 'ai-full'
      }));

      // Store generation metadata
      const { data: generation, error } = await this.supabase
        .from('generations')
        .insert({
          user_id: userId,
          model: this.defaultModel,
          generated_count: flashcards.length,
          source_text_hash: sourceTextHash,
          source_text_length: sourceText.length,
          generation_duration_ms: Date.now() - startTime
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to store generation: ${error.message}`);
      }

      return {
        generationId: generation.id,
        draft_flashcards: flashcards,
        generated_count: flashcards.length
      };
    } catch (error) {
      // Log error and store in generation_error_logs
      await this.logGenerationError(error, sourceText, userId);
      throw error;
    }
  }

  private async logGenerationError(error: unknown, sourceText: string, userId: string): Promise<void> {
    let errorCode = 'GENERATION_FAILED';
    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle OpenRouter specific errors
      if ('code' in error && typeof (error as any).code === 'string') {
        errorCode = (error as any).code;
      }
    }

    const sourceTextHash = createHash('md5')
      .update(sourceText)
      .digest('hex');

    await this.supabase
      .from('generation_error_logs')
      .insert({
        user_id: userId,
        error_code: errorCode,
        error_message: errorMessage,
        model: this.defaultModel,
        source_text_hash: sourceTextHash,
        source_text_length: sourceText.length
      });
  }
}
