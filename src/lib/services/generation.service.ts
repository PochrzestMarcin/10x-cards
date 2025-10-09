import type { SupabaseClient } from '../../db/supabase.client';
import type { GenerationCreateResponseDto } from '../../types';
import { createHash } from 'crypto';
import { AIService } from './ai.service';

export class GenerationService {
  private readonly aiService = new AIService();

  constructor(private readonly supabase: SupabaseClient) {}

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

      // Generate flashcards using AI service
      const flashcards = await this.aiService.generateFlashcards(sourceText);

      // Store generation metadata
      const { data: generation, error } = await this.supabase
        .from('generations')
        .insert({
          user_id: userId,
           model: 'mock-model-v1',
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const sourceTextHash = createHash('md5')
      .update(sourceText)
      .digest('hex');

    await this.supabase
      .from('generation_error_logs')
      .insert({
        user_id: userId,
        error_code: 'GENERATION_FAILED',
        error_message: errorMessage,
        model: 'mock-model-v1',
        source_text_hash: sourceTextHash,
        source_text_length: sourceText.length
      });
  }
}
