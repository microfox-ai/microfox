import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
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

export interface BatchRequestOptions {
  delay?: number; // Delay between requests in milliseconds
  onProgress?: (completed: number, total: number) => void; // Progress callback
}

export type BatchRequest = {
  type:
    | 'web'
    | 'image'
    | 'video'
    | 'news'
    | 'suggest'
    | 'spellcheck'
    | 'summarizer'
    | 'localPoi'
    | 'localDescriptions';
  params:
    | WebSearchParams
    | ImageSearchParams
    | VideoSearchParams
    | NewsSearchParams
    | SuggestSearchParams
    | SpellcheckSearchParams
    | SummarizerSearchParams
    | LocalSearchParams;
};

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

    const tracker = createDefaultMicrofoxUsageTracker();
    tracker?.trackApi1Usage('brave', 'dataForSearch', {
      requestCount: 1,
    });

    return response.json() as Promise<T>;
  }

  async webSearch(params: WebSearchParams): Promise<WebSearchApiResponse> {
    return this.request<WebSearchApiResponse>('/web/search', params);
  }

  async batchWebSearch(
    params: WebSearchParams[],
  ): Promise<WebSearchApiResponse[]> {
    return this.batchProcess(params.map(p => ({ type: 'web', params: p })));
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

  async batchImageSearch(
    params: ImageSearchParams[],
  ): Promise<ImageSearchApiResponse[]> {
    return this.batchProcess(params.map(p => ({ type: 'image', params: p })));
  }

  async videoSearch(
    params: VideoSearchParams,
  ): Promise<VideoSearchApiResponse> {
    return this.request<VideoSearchApiResponse>('/videos/search', params);
  }

  async batchVideoSearch(
    params: VideoSearchParams[],
  ): Promise<VideoSearchApiResponse[]> {
    return this.batchProcess(params.map(p => ({ type: 'video', params: p })));
  }

  async newsSearch(params: NewsSearchParams): Promise<NewsSearchApiResponse> {
    return this.request<NewsSearchApiResponse>('/news/search', params);
  }

  async batchNewsSearch(
    params: NewsSearchParams[],
  ): Promise<NewsSearchApiResponse[]> {
    return this.batchProcess(params.map(p => ({ type: 'news', params: p })));
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

  /**
   * Process multiple requests sequentially with a configurable delay
   * @param requests Array of requests to process
   * @param options Configuration options for batch processing
   * @returns Array of responses in the same order as requests
   */
  async batchProcess<T extends any[]>(
    requests: BatchRequest[],
    options: BatchRequestOptions = {},
  ): Promise<T> {
    const { delay = 1000, onProgress } = options;
    const results: any[] = [];
    const total = requests.length;

    for (let i = 0; i < total; i++) {
      const request = requests[i];
      let response: any;

      try {
        switch (request.type) {
          case 'web':
            response = await this.webSearch(request.params as WebSearchParams);
            break;
          case 'image':
            response = await this.imageSearch(
              request.params as ImageSearchParams,
            );
            break;
          case 'video':
            response = await this.videoSearch(
              request.params as VideoSearchParams,
            );
            break;
          case 'news':
            response = await this.newsSearch(
              request.params as NewsSearchParams,
            );
            break;
          case 'suggest':
            response = await this.suggestSearch(
              request.params as SuggestSearchParams,
            );
            break;
          case 'spellcheck':
            response = await this.spellcheckSearch(
              request.params as SpellcheckSearchParams,
            );
            break;
          case 'summarizer':
            response = await this.summarizerSearch(
              request.params as SummarizerSearchParams,
            );
            break;
          case 'localPoi':
            response = await this.localPoiSearch(
              request.params as LocalSearchParams,
            );
            break;
          case 'localDescriptions':
            response = await this.localDescriptionsSearch(
              request.params as LocalSearchParams,
            );
            break;
          default:
            throw new Error(`Unknown request type: ${request.type}`);
        }

        results.push(response);
      } catch (error) {
        results.push({
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      if (onProgress) {
        onProgress(i + 1, total);
      }

      // Add delay between requests, except for the last one
      if (i < total - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return results as T;
  }
}

export function createBraveSDK(options?: BraveSDKOptions): BraveSDK {
  return new BraveSDK(options);
}
