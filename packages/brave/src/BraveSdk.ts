import {
  createHeaders,
  createLocalSearchHeaders,
  LocalSearchHeaders,
  RequestHeaders,
} from './lib/headers';
import {
  BraveSDKOptions,
  BraveSDKOptionsSchema,
  ImageSearchParams,
  NewsSearchParams,
  SpellcheckSearchParams,
  SuggestSearchParams,
  VideoSearchParams,
} from './schemas';
import { ImageSearchApiResponse } from './schemas/image-response-schema';
import { SummarizerSearchParams } from './schemas/index';
import { NewsSearchApiResponse } from './schemas/news-response-schema';
import {
  LocalSearchParams,
  WebSearchParams,
} from './schemas/request-search-params';
import { SpellCheckSearchApiResponse } from './schemas/spellcheck-response-schema';
import { SuggestSearchApiResponse } from './schemas/suggest-response-schema';
import { SummarizerSearchApiResponse } from './schemas/summarise-response-schema';
import { VideoSearchApiResponse } from './schemas/video-response-schema';
import {
  LocalDescriptionsSearchApiResponse,
  LocalPoiSearchApiResponse,
  WebSearchApiResponse,
} from './schemas/web-response-schemas';

export type MiddlewareFunction = (request: {
  url: URL;
  params: Record<string, any>;
  headers: RequestHeaders | LocalSearchHeaders;
  useLocalSearchHeaders: boolean;
}) => Promise<{
  url: URL;
  params: Record<string, any>;
  headers: RequestHeaders | LocalSearchHeaders;
  useLocalSearchHeaders: boolean;
}>;

class BraveSDK {
  private apiKey: string;
  private baseUrl = 'https://api.search.brave.com/res/v1';
  private headers: RequestHeaders;
  private localSearchHeaders: LocalSearchHeaders;
  private middleware: MiddlewareFunction[] = [];

  constructor(options?: BraveSDKOptions) {
    const validatedOptions = options
      ? BraveSDKOptionsSchema.parse(options)
      : undefined;
    this.apiKey = validatedOptions?.apiKey || process.env.BRAVE_API_KEY || '';

    if (!this.apiKey) {
      throw new Error(
        'API key is required. Please provide it in the constructor or set the BRAVE_API_KEY environment variable.',
      );
    }

    // Initialize headers
    this.headers = createHeaders({
      apiKey: this.apiKey,
      ...validatedOptions?.headers,
    });
    this.localSearchHeaders = createLocalSearchHeaders({
      apiKey: this.apiKey,
      ...validatedOptions?.localSearchHeaders,
    });

    if (options?.enableRedisTracking) {
      this.middleware.push(async request => {
        // TODO: Implement Redis tracking
        return request;
      });
    }
  }

  /**
   * Add a middleware function to the SDK
   * @param middleware The middleware function to add
   */
  use(middleware: MiddlewareFunction): void {
    this.middleware.push(middleware);
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, any> = {},
    useLocalSearchHeaders = false,
  ): Promise<T> {
    let url = new URL(`${this.baseUrl}${endpoint}`);
    let currentParams = { ...params };
    let currentHeaders = useLocalSearchHeaders
      ? this.localSearchHeaders
      : this.headers;
    let currentUseLocalSearchHeaders = useLocalSearchHeaders;

    // Apply all middleware functions in sequence
    for (const middleware of this.middleware) {
      const result = await middleware({
        url,
        params: currentParams,
        headers: currentHeaders,
        useLocalSearchHeaders: currentUseLocalSearchHeaders,
      });
      url = result.url;
      currentParams = result.params;
      currentHeaders = result.headers;
      currentUseLocalSearchHeaders = result.useLocalSearchHeaders;
    }

    // Apply the final parameters to the URL
    Object.entries(currentParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v.toString()));
      } else if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: currentHeaders,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async webSearch(params: WebSearchParams): Promise<WebSearchApiResponse> {
    return this.request<WebSearchApiResponse>('/web/search', params);
  }

  async localPoiSearch(
    params: LocalSearchParams,
  ): Promise<LocalPoiSearchApiResponse> {
    return this.request<LocalPoiSearchApiResponse>('/local/pois', params, true);
  }

  async localDescriptionsSearch(
    params: LocalSearchParams,
  ): Promise<LocalDescriptionsSearchApiResponse> {
    return this.request<LocalDescriptionsSearchApiResponse>(
      '/local/descriptions',
      params,
      true,
    );
  }

  async summarizerSearch(
    params: SummarizerSearchParams,
  ): Promise<SummarizerSearchApiResponse> {
    return this.request<SummarizerSearchApiResponse>(
      '/summarizer/search',
      params,
    );
  }

  async imageSearch(
    params: ImageSearchParams,
  ): Promise<ImageSearchApiResponse> {
    return this.request<ImageSearchApiResponse>('/images/search', params);
  }

  async videoSearch(
    params: VideoSearchParams,
  ): Promise<VideoSearchApiResponse> {
    return this.request<VideoSearchApiResponse>('/videos/search', params);
  }

  async newsSearch(params: NewsSearchParams): Promise<NewsSearchApiResponse> {
    return this.request<NewsSearchApiResponse>('/news/search', params);
  }

  async suggestSearch(
    params: SuggestSearchParams,
  ): Promise<SuggestSearchApiResponse> {
    return this.request<SuggestSearchApiResponse>('/suggest/search', params);
  }

  async spellcheckSearch(
    params: SpellcheckSearchParams,
  ): Promise<SpellCheckSearchApiResponse> {
    return this.request<SpellCheckSearchApiResponse>(
      '/spellcheck/search',
      params,
    );
  }
}

export function createBraveSDK(options?: BraveSDKOptions): BraveSDK {
  return new BraveSDK(options);
}
