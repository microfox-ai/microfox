import { z } from 'zod';

// Query schema
export const SuggestQuerySchema = z.object({
  original: z.string(),
});

// SuggestResult schema
export const SuggestResultSchema = z.object({
  query: z.string(),
  is_entity: z.boolean(),
  title: z.string(),
  description: z.string(),
  img: z.string(),
});

// Top level SuggestSearchApiResponse schema
export const SuggestSearchApiResponseSchema = z.object({
  type: z.literal('suggest'),
  query: SuggestQuerySchema,
  results: z.array(SuggestResultSchema),
});

// Types
export type SuggestQuery = z.infer<typeof SuggestQuerySchema>;
export type SuggestResult = z.infer<typeof SuggestResultSchema>;
export type SuggestSearchApiResponse = z.infer<
  typeof SuggestSearchApiResponseSchema
>;
