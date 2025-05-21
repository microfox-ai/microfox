import { z } from 'zod';
import {
  MetaUrlSchema,
  ThumbnailSchema,
  ImagePropertiesSchema,
} from './schemas';

// ImageResult schema
const ImageResultSchema = z.object({
  type: z.literal('image_result'),
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  page_fetched: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
  thumbnail: ThumbnailSchema,
  properties: ImagePropertiesSchema,
  meta_url: MetaUrlSchema,
});

// Query schema
const ImageQuerySchema = z.object({
  original: z.string(),
  altered: z.string(),
  spellcheck_off: z.boolean(),
  show_strict_warning: z.string(),
});

// Main ImageSearchApiResponse schema
export const ImageSearchApiResponseSchema = z.object({
  type: z.literal('images'),
  query: ImageQuerySchema,
  results: z.array(ImageResultSchema),
});

// TypeScript types
export type ImageResult = z.infer<typeof ImageResultSchema>;
export type ImageQuery = z.infer<typeof ImageQuerySchema>;
export type ImageSearchApiResponse = z.infer<
  typeof ImageSearchApiResponseSchema
>;
