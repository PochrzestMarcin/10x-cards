import { z } from 'zod';
import type { FlashcardSource } from '../../types';

const flashcardSourceEnum = z.enum(['ai-full', 'ai-edited', 'manual'] as const);

const flashcardCreateDtoSchema = z.object({
  front: z.string().min(1).max(200),
  back: z.string().min(1).max(500),
  source: flashcardSourceEnum,
  generation_id: z.number().nullable()
}).refine(data => {
  // Rule: generation_id must be non-null for AI sources
  if (data.source === 'ai-full' || data.source === 'ai-edited') {
    return data.generation_id !== null;
  }
  // Rule: generation_id must be null for manual source
  if (data.source === 'manual') {
    return data.generation_id === null;
  }
  return true;
}, {
  message: "generation_id must be provided for AI sources and must be null for manual source"
});

export const flashcardsCreateSchema = z.object({
  flashcards: z.array(flashcardCreateDtoSchema)
    .min(1)
    .max(100) // Limit array size to prevent abuse
});

export type FlashcardsCreateSchema = typeof flashcardsCreateSchema;
