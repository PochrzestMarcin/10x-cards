import type { SupabaseClient } from '../../db/supabase.client';
import type { CreateFlashcardCommand, FlashcardDTO, FlashcardInsert } from '../../types';
import { flashcardsCreateSchema } from '../schemas/flashcard.schema';

export class FlashcardService {
  /**
   * Creates multiple flashcards for a user, validating generation ownership if applicable
   * @throws {Error} If validation fails or database operations fail
   */
  static async createFlashcards(
    command: CreateFlashcardCommand,
    userId: string,
    supabase: SupabaseClient
  ): Promise<FlashcardDTO[]> {
    // Validate command structure and business rules
    const validatedData = flashcardsCreateSchema.parse(command);

    // Get unique generation IDs that need verification
    const generationIds = [...new Set(
      validatedData.flashcards
        .map(f => f.generation_id)
        .filter((id): id is number => id !== null)
    )];

    // Verify generation ownership if any AI-generated cards
    if (generationIds.length > 0) {
      const { data: generations, error } = await supabase
        .from('generations')
        .select('id')
        .eq('user_id', userId)
        .in('id', generationIds);

      if (error) throw new Error('Failed to verify generation ownership');
      
      // Check if all referenced generations were found
      const foundIds = new Set(generations?.map(g => g.id));
      const missingIds = generationIds.filter(id => !foundIds.has(id));
      
      if (missingIds.length > 0) {
        throw new Error(`Generations not found or not owned by user: ${missingIds.join(', ')}`);
      }
    }

    // Prepare flashcards for insertion
    const flashcardsToInsert: FlashcardInsert[] = validatedData.flashcards.map(card => ({
      ...card,
      user_id: userId
    }));

    // Perform bulk insert
    const { data: createdFlashcards, error: insertError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert)
      .select('id, front, back, source, created_at, updated_at, generation_id');

    if (insertError) {
      throw new Error('Failed to create flashcards');
    }

    if (!createdFlashcards) {
      throw new Error('No flashcards were created');
    }

    return createdFlashcards;
  }
}
