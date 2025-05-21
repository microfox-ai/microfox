export { createBraveSDK } from './BraveSdk';

// Export types from schemas
export type {
  BraveSDKOptions,
  ImageSearchParams,
  VideoSearchParams,
  NewsSearchParams,
  SpellcheckSearchParams,
  SuggestSearchParams,
  SummarizerSearchParams,
} from './schemas';

export {
  BraveSDKOptionsSchema,
  ImageSearchParamsSchema,
  VideoSearchParamsSchema,
  NewsSearchParamsSchema,
  SpellcheckSearchParamsSchema,
  SuggestSearchParamsSchema,
  SummarizerSearchParamsSchema,
} from './schemas';

export type {
  WebSearchParams,
  LocalSearchParams,
} from './schemas/request-search-params';

export {
  WebSearchParamsSchema,
  LocalSearchParamsSchema,
} from './schemas/request-search-params';

// Export header types
export type {
  RequestHeaders,
  LocalSearchHeaders,
} from './schemas/request-headers';
export {
  RequestHeadersSchema,
  LocalSearchHeadersSchema,
} from './schemas/request-headers';

// Export response types
export type {
  WebSearchApiResponse,
  LocalPoiSearchApiResponse,
  LocalDescriptionsSearchApiResponse,
} from './schemas/web-response-schemas';

export type { ImageSearchApiResponse } from './schemas/image-response-schema';

export type { VideoSearchApiResponse } from './schemas/video-response-schema';

export type { NewsSearchApiResponse } from './schemas/news-response-schema';

export type { SpellCheckSearchApiResponse } from './schemas/spellcheck-response-schema';

export type { SuggestSearchApiResponse } from './schemas/suggest-response-schema';

export type { SummarizerSearchApiResponse } from './schemas/summarise-response-schema';

// Export schema types
export type { Query, SearchResult } from './schemas/web-response-schemas';

export type { SuggestResult } from './schemas/suggest-response-schema';

export type { VideoResult } from './schemas/video-response-schema';

export type {
  Thumbnail,
  Profile,
  Rating,
  Unit,
  Person,
  Action,
  Image,
  Price,
  Offer,
  HowTo,
  Book,
  Product,
  Review,
  CreativeWork,
  Summarizer,
  QA,
  FAQ,
  Answer,
  Result,
  DeepResult,
  MetaUrl,
} from './schemas/schemas';
