import type { Database } from './db/database.types';

//Aliases for the database tables
export type Flashcard = Database['public']['Tables']['flashcards']['Row'];
export type FlashcardInsert = Database['public']['Tables']['flashcards']['Insert'];
export type Generation = Database['public']['Tables']['generations']['Row'];
export type GenerationErrorLog = Database['public']['Tables']['generation_error_logs']['Row'];

/* ------------------------------------------------------------
 * Shared helpers & enums
 * ----------------------------------------------------------*/

/**
 * Allowed sources for flashcards as defined by business rules.
 * Keep in sync with `flashcards.source` database enum (varchar in DB).
 */
export type FlashcardSource = 'ai-full' | 'ai-edited' | 'manual'

/** Standard pagination metadata returned by list endpoints */
export interface PaginationDto {
  page: number
  limit: number
  total: number
}

/**
 * Public representation of a flashcard returned by the API.
 * Omits internal fields such as `user_id` while exposing the rest.
 */
export type FlashcardDTO = Pick<
  Flashcard,
  'id' | 'front' | 'back' | 'source' | 'created_at' | 'updated_at' | 'generation_id'
>;

/** Paginated list response for flashcards */
export interface PaginatedFlashcardsResponseDTO {
  data: FlashcardDTO[]
  pagination: PaginationDto
}

//Flashcard create dto & command model
export interface FlashcardCreateDto {
  front: string;
  back: string;
  source: FlashcardSource;
  generation_id: number | null;
}

export interface CreateFlashcardCommand {
  flashcards: FlashcardCreateDto[]
}

//Flashcard update dto & command model
export type FlashcardUpdateDto = Partial<{
    front: string;
    back: string;
    source: FlashcardSource;
    generation_id: number | null;
}>;

/* ------------------------------------------------------------
 * Generations – DTOs & Commands
 * ----------------------------------------------------------*/

/** Command body for `POST /generations` */
export interface GenerateFlashcardsCommand {
  /** User provided source text (1000–10000 chars) */
  source_text: string
}

/* ------------------------------------------------------------
 * Flashcard proposal – DTOs
 * ----------------------------------------------------------*/

export interface FlashcardProposalDto {
  front: string;
  back: string;
  source: "ai-full";
}

// Generation Create Response DTO

export interface GenerationCreateResponseDto {
  generationId: number;
  draft_flashcards: FlashcardProposalDto[];
  generated_count: number;
}

// Generation Detail DTO

export type GenerationDetailDto = Generation & {
  flashcards?: FlashcardDTO[];
}

// Generation Error Log DTO

export type GenerationErrorLogDto = Pick<
GenerationErrorLog,
"id" | "error_code" | "error_message" | "created_at" | "model" | "source_text_hash" | "source_text_length"
>;

/** Response type for POST /flashcards endpoint */
export interface CreateFlashcardsResponseDto {
  flashcards: FlashcardDTO[];
}

/** Query parameters for listing flashcards */
export interface FlashcardsListQuery {
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'source';
  order?: 'asc' | 'desc';
  source?: FlashcardSource;
  generation_id?: number;
}

/** Response type for DELETE /flashcards/{id} endpoint */
export interface DeleteFlashcardResponseDto {
  message: string;
}

/** View model for flashcard in the UI */
export interface FlashcardViewModel extends FlashcardDTO {
  isEditing: boolean;
  validationErrors?: {
    front?: string;
    back?: string;
  };
}