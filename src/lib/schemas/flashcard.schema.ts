import { z } from "zod";
import type { FlashcardSource } from "../../types";

// Existing schemas...

/**
 * Schema for validating flashcard list query parameters
 */
export const flashcardsListQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  sort: z.enum(["created_at", "source"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
  source: z.enum(["ai-full", "ai-edited", "manual"] as const).optional(),
  generation_id: z.coerce.number().positive().optional(),
});

export type FlashcardsListQuery = z.infer<typeof flashcardsListQuerySchema>;

/**
 * Schema for validating flashcard update requests
 */
export const flashcardUpdateSchema = z
  .object({
    front: z.string().min(1).max(200).optional(),
    back: z.string().min(1).max(500).optional(),
    source: z.enum(["manual", "ai-edited"] as const).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type FlashcardUpdate = z.infer<typeof flashcardUpdateSchema>;
