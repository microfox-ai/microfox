import { z } from 'zod';
import { MetaUrlSchema } from './schemas';
import { VideoDataSchema } from './schemas';
import { ThumbnailSchema } from './schemas';

// VideoResult schema
const VideoResultSchema = z.object({
  type: z.literal('video_result'),
  url: z.string(),
  title: z.string(),
  description: z.string(),
  age: z.string(),
  page_age: z.string(),
  page_fetched: z.string(),
  thumbnail: ThumbnailSchema,
  video: VideoDataSchema,
  meta_url: MetaUrlSchema,
});

// Query schema
const VideoQuerySchema = z.object({
  original: z.string(),
  altered: z.string(),
  cleaned: z.string(),
  spellcheck_off: z.boolean(),
  show_strict_warning: z.string(),
});

// Main VideoSearchApiResponse schema
export const VideoSearchApiResponseSchema = z.object({
  type: z.literal('videos'),
  query: VideoQuerySchema,
  results: z.array(VideoResultSchema),
});

// Type exports
export type VideoResult = z.infer<typeof VideoResultSchema>;
export type VideoQuery = z.infer<typeof VideoQuerySchema>;
export type VideoSearchApiResponse = z.infer<
  typeof VideoSearchApiResponseSchema
>;
