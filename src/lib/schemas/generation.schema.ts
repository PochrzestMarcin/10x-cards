import { z } from 'zod';
import type { GenerateFlashcardsCommand } from '../../types';

export const GenerateFlashcardsCommandSchema = z.object({
  source_text: z
    .string()
    .min(1000, 'Source text must be at least 1000 characters')
    .max(10000, 'Source text cannot exceed 10000 characters')
}) satisfies z.ZodType<GenerateFlashcardsCommand>;

export type GenerateFlashcardsCommandSchemaType = z.infer<typeof GenerateFlashcardsCommandSchema>;
