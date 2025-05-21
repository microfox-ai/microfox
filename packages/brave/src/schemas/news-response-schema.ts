import { z } from 'zod';
import { MetaUrlSchema, ThumbnailSchema } from './schemas';

// Query schema
const NewsQuerySchema = z.object({
  original: z.string(),
  altered: z.string(),
  cleaned: z.string(),
  spellcheck_off: z.boolean(),
  show_strict_warning: z.boolean(),
});

// NewsResult schema
const NewsResultSchema = z.object({
  type: z.literal('news_result'),
  url: z.string(),
  title: z.string(),
  description: z.string(),
  age: z.string(),
  page_age: z.string(),
  page_fetched: z.string(),
  breaking: z.boolean(),
  thumbnail: ThumbnailSchema,
  meta_url: MetaUrlSchema,
  extra_snippets: z.array(z.string()),
});

// Main NewsSearchApiResponse schema
export const NewsSearchApiResponseSchema = z.object({
  type: z.literal('news'),
  query: NewsQuerySchema,
  results: z.array(NewsResultSchema),
});

// TypeScript types derived from the schemas
export type NewsQuery = z.infer<typeof NewsQuerySchema>;
export type NewsResult = z.infer<typeof NewsResultSchema>;
export type NewsSearchApiResponse = z.infer<typeof NewsSearchApiResponseSchema>;
