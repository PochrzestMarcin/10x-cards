import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../db/database.types';
import type { CreateFlashcardCommand, FlashcardDTO, FlashcardsListQuery, PaginatedFlashcardsResponseDTO } from '../../types';
import { flashcardsListQuerySchema } from '../schemas/flashcard.schema';

export class FlashcardService {
  /**
   * Lists flashcards with pagination, sorting and filtering
   */
  static async listFlashcards(
    query: FlashcardsListQuery,
    userId: string,
    supabase: SupabaseClient<Database>
  ): Promise<PaginatedFlashcardsResponseDTO> {
    // Validate query parameters
    const validatedQuery = flashcardsListQuerySchema.parse(query);

    // Calculate pagination offset
    const offset = (validatedQuery.page - 1) * validatedQuery.limit;

    // Build base query with user filter
    let dbQuery = supabase
      .from('flashcards')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply optional filters
    if (validatedQuery.source) {
      dbQuery = dbQuery.eq('source', validatedQuery.source);
    }
    if (validatedQuery.generation_id) {
      dbQuery = dbQuery.eq('generation_id', validatedQuery.generation_id);
    }

    // Apply sorting
    dbQuery = dbQuery.order(validatedQuery.sort, {
      ascending: validatedQuery.order === 'asc'
    });

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + validatedQuery.limit - 1);

    // Execute query
    const { data, error, count } = await dbQuery;

    if (error) {
      throw new Error('Failed to fetch flashcards');
    }

    // Map to DTOs and construct response
    const flashcards: FlashcardDTO[] = data.map(card => ({
      id: card.id,
      front: card.front,
      back: card.back,
      source: card.source,
      created_at: card.created_at,
      updated_at: card.updated_at,
      generation_id: card.generation_id
    }));

    return {
      data: flashcards,
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total: count || 0
      }
    };
  }

  /**
   * Creates new flashcards for a user
   */
  static async createFlashcards(
    command: CreateFlashcardCommand,
    userId: string,
    supabase: SupabaseClient<Database>
  ): Promise<FlashcardDTO[]> {
    // Insert flashcards with user_id
    const { data, error } = await supabase
      .from('flashcards')
      .insert(
        command.flashcards.map(card => ({
          ...card,
          user_id: userId
        }))
      )
      .select();

    if (error) {
      throw new Error('Failed to create flashcards');
    }

    // Map to DTOs
    return data.map(card => ({
      id: card.id,
      front: card.front,
      back: card.back,
      source: card.source,
      created_at: card.created_at,
      updated_at: card.updated_at,
      generation_id: card.generation_id
    }));
  }
}