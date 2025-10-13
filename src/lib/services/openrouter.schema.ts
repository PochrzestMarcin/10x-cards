import { z } from 'zod';

export const configSchema = z.object({
  apiUrl: z.string().url().optional().default('https://openrouter.ai/api/v1'),
  systemMessage: z.string().optional().default(''),
  modelName: z.string().min(1).optional().default('google/gemma-3n-e2b-it:free'),
  modelParameters: z.object({
    temperature: z.number().min(0).max(2).optional().default(0.7),
    top_p: z.number().min(0).max(1).optional().default(0.95),
    frequency_penalty: z.number().min(-2).max(2).optional().default(0),
    presence_penalty: z.number().min(-2).max(2).optional().default(0)
  }).optional(),
  timeout: z.number().positive().optional().default(30000),
  maxRetries: z.number().int().positive().optional().default(3)
});

export const messageSchema = z.object({
  content: z.string(),
  role: z.string()
});

export const choiceSchema = z.object({
  message: messageSchema,
  finish_reason: z.string()
});

export const usageSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number()
});

export const apiResponseSchema = z.object({
  choices: z.array(choiceSchema),
  model: z.string(),
  usage: usageSchema
});

export const modelParametersSchema = z.object({
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  frequency_penalty: z.number().optional(),
  presence_penalty: z.number().optional()
});
