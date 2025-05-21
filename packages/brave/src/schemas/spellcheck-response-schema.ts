import { z } from 'zod';

export const QuerySchema = z.object({
  original: z.string(),
});

export const SpellCheckResultSchema = z.object({
  query: z.string(),
});

export const SpellCheckSearchApiResponseSchema = z.object({
  type: z.literal('spellcheck'),
  query: QuerySchema,
  results: z.array(SpellCheckResultSchema),
});

export type Query = z.infer<typeof QuerySchema>;
export type SpellCheckResult = z.infer<typeof SpellCheckResultSchema>;
export type SpellCheckSearchApiResponse = z.infer<
  typeof SpellCheckSearchApiResponseSchema
>;
