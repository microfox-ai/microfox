import { z } from 'zod';
import {
  ArticleSchema,
  BookSchema,
  CreativeWorkSchema,
  DeepResultSchema,
  DiscussionsSchema,
  FAQSchema,
  GraphInfoboxSchema,
  LanguageSchema,
  LocationDescriptionSchema,
  LocationResultSchema,
  LocationsSchema,
  MetaUrlSchema,
  MixedResponseSchema,
  MovieDataSchema,
  MusicRecordingSchema,
  NewsSchema,
  OrganizationSchema,
  ProductSchema,
  QAPageSchema,
  RatingSchema,
  RecipeSchema,
  ResultSchema,
  ReviewSchema,
  SoftwareSchema,
  ThumbnailSchema,
  VideoDataSchema,
  VideosSchema,
} from './schemas';

// Query Schema
export const QuerySchema = z.object({
  original: z.string(),
  show_strict_warning: z.boolean().optional(),
  altered: z.string().optional(),
  safesearch: z.boolean().optional(),
  is_navigational: z.boolean().optional(),
  is_geolocal: z.boolean().optional(),
  local_decision: z.string().optional(),
  local_locations_idx: z.number().optional(),
  is_trending: z.boolean().optional(),
  is_news_breaking: z.boolean().optional(),
  ask_for_location: z.boolean().optional(),
  language: LanguageSchema.optional(),
  spellcheck_off: z.boolean().optional(),
  country: z.string().optional(),
  bad_results: z.boolean().optional(),
  should_fallback: z.boolean().optional(),
  lat: z.string().optional(),
  long: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  header_country: z.string().optional(),
  more_results_available: z.boolean().optional(),
  custom_location_label: z.string().optional(),
  reddit_cluster: z.string().optional(),
});

// Search Result Schema
export const SearchResultSchema = z.object({
  type: z.literal('search_result'),
  subtype: z.literal('generic'),
  is_live: z.boolean(),
  deep_results: DeepResultSchema.optional(),
  schemas: z.array(z.array(z.any())).optional(),
  meta_url: MetaUrlSchema.optional(),
  thumbnail: ThumbnailSchema.optional(),
  age: z.string().optional(),
  language: z.string(),
  location: LocationResultSchema.optional(),
  video: VideoDataSchema.optional(),
  movie: MovieDataSchema.optional(),
  faq: FAQSchema.optional(),
  qa: QAPageSchema.optional(),
  book: BookSchema.optional(),
  rating: RatingSchema.optional(),
  article: ArticleSchema.optional(),
  product: ProductSchema.optional(),
  product_cluster: z.array(ProductSchema).optional(),
  cluster_type: z.string().optional(),
  cluster: z.array(ResultSchema).optional(),
  creative_work: CreativeWorkSchema.optional(),
  music_recording: MusicRecordingSchema.optional(),
  review: ReviewSchema.optional(),
  software: SoftwareSchema.optional(),
  recipe: RecipeSchema.optional(),
  organization: OrganizationSchema.optional(),
  content_type: z.string().optional(),
  extra_snippets: z.array(z.string()).optional(),
});

// Search Schema
export const SearchSchema = z.object({
  type: z.literal('search'),
  results: z.array(SearchResultSchema),
  family_friendly: z.boolean(),
});

// Web Search API Response Schema
export const WebSearchApiResponseSchema = z.object({
  type: z.literal('web'),
  discussions: DiscussionsSchema.optional(),
  faq: FAQSchema.optional(),
  infobox: GraphInfoboxSchema.optional(),
  locations: LocationsSchema.optional(),
  mixed: MixedResponseSchema.optional(),
  news: NewsSchema.optional(),
  query: QuerySchema.optional(),
  rich_data: z.any().optional(), // RichDataSchema
  search: SearchSchema.optional(),
  videos: VideosSchema.optional(),
});

// Local POI Search API Response Schema
export const LocalPoiSearchApiResponseSchema = z.object({
  type: z.literal('local_pois'),
  results: z.array(LocationResultSchema).optional(),
});

// Local Descriptions Search API Response Schema
export const LocalDescriptionsSearchApiResponseSchema = z.object({
  type: z.literal('local_descriptions'),
  results: z.array(LocationDescriptionSchema).optional(),
});

// Type definitions
export type Query = z.infer<typeof QuerySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type Search = z.infer<typeof SearchSchema>;
export type WebSearchApiResponse = z.infer<typeof WebSearchApiResponseSchema>;
export type LocalPoiSearchApiResponse = z.infer<
  typeof LocalPoiSearchApiResponseSchema
>;
export type LocalDescriptionsSearchApiResponse = z.infer<
  typeof LocalDescriptionsSearchApiResponseSchema
>;
