import { z } from 'zod';

// Zod schemas for input validation
const CountryCode = z.string().length(2).describe('Two-letter country code');
const LanguageCode = z
  .string()
  .min(2)
  .describe('Language code (e.g., "en", "es")');
const UILanguageCode = z
  .string()
  .regex(/^[a-z]{2}-[A-Z]{2}$/)
  .describe('UI language code (e.g., "en-US")');
const SafeSearchOption = z
  .enum(['off', 'moderate', 'strict'])
  .describe('SafeSearch option');
const FreshnessOption = z
  .enum(['pd', 'pw', 'pm', 'py'])
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}to\d{4}-\d{2}-\d{2}$/))
  .describe('Freshness option');

const WebSearchParams = z.object({
  q: z.string().max(400).describe('Search query'),
  country: CountryCode.optional(),
  search_lang: LanguageCode.optional(),
  ui_lang: UILanguageCode.optional(),
  count: z.number().int().min(1).max(20).optional(),
  offset: z.number().int().min(0).max(9).optional(),
  safesearch: SafeSearchOption.optional(),
  freshness: FreshnessOption.optional(),
  text_decorations: z.boolean().optional(),
  spellcheck: z.boolean().optional(),
});

const ImageSearchParams = z.object({
  q: z.string().max(400).describe('Search query'),
  country: CountryCode.optional(),
  search_lang: LanguageCode.optional(),
  count: z.number().int().min(1).max(100).optional(),
  safesearch: SafeSearchOption.optional(),
  spellcheck: z.boolean().optional(),
});

const VideoSearchParams = z.object({
  q: z.string().max(400).describe('Search query'),
  country: CountryCode.optional(),
  search_lang: LanguageCode.optional(),
  ui_lang: UILanguageCode.optional(),
  count: z.number().int().min(1).max(50).optional(),
  offset: z.number().int().min(0).max(9).optional(),
  spellcheck: z.boolean().optional(),
  safesearch: SafeSearchOption.optional(),
  freshness: FreshnessOption.optional(),
});

const NewsSearchParams = z.object({
  q: z.string().max(400).describe('Search query'),
  country: CountryCode.optional(),
  search_lang: LanguageCode.optional(),
  ui_lang: UILanguageCode.optional(),
  count: z.number().int().min(1).max(50).optional(),
  offset: z.number().int().min(0).max(9).optional(),
  spellcheck: z.boolean().optional(),
  safesearch: SafeSearchOption.optional(),
  freshness: FreshnessOption.optional(),
  extra_snippets: z.boolean().optional(),
});

const SuggestSearchParams = z.object({
  q: z.string().max(400).describe('Search query'),
  country: CountryCode.optional(),
  lang: LanguageCode.optional(),
  count: z.number().int().min(1).max(20).optional(),
  rich: z.boolean().optional(),
});

const SpellcheckParams = z.object({
  q: z.string().max(400).describe('Search query'),
  country: CountryCode.optional(),
  lang: LanguageCode.optional(),
});

const SummarizerSearchParams = z.object({
  key: z.string().describe('Summarizer key'),
  entity_info: z.boolean().optional(),
});

/**
 * Brave SDK configuration options
 */
export interface BraveSDKOptions {
  apiKey: string;
  baseUrl?: string;
}

/**
 * Brave SDK class for interacting with the Brave Search API
 */
export class BraveSDK {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  /**
   * Create a new instance of the Brave SDK
   * @param options SDK configuration options
   */
  constructor(options: BraveSDKOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'https://api.search.brave.com/res/v1';
  }

  /**
   * Make an API request to the Brave Search API
   * @param endpoint API endpoint
   * @param params Query parameters
   * @returns Promise resolving to the API response
   */
  private async makeRequest(
    endpoint: string,
    params: Record<string, string | number | boolean>,
  ): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Perform a web search
   * @param params Web search parameters
   * @returns Promise resolving to the web search results
   */
  async webSearch(params: z.infer<typeof WebSearchParams>) {
    const validatedParams = WebSearchParams.parse(params);
    return this.makeRequest('/web/search', validatedParams);
  }

  /**
   * Perform an image search
   * @param params Image search parameters
   * @returns Promise resolving to the image search results
   */
  async imageSearch(params: z.infer<typeof ImageSearchParams>) {
    const validatedParams = ImageSearchParams.parse(params);
    return this.makeRequest('/images/search', validatedParams);
  }

  /**
   * Perform a video search
   * @param params Video search parameters
   * @returns Promise resolving to the video search results
   */
  async videoSearch(params: z.infer<typeof VideoSearchParams>) {
    const validatedParams = VideoSearchParams.parse(params);
    return this.makeRequest('/videos/search', validatedParams);
  }

  /**
   * Perform a news search
   * @param params News search parameters
   * @returns Promise resolving to the news search results
   */
  async newsSearch(params: z.infer<typeof NewsSearchParams>) {
    const validatedParams = NewsSearchParams.parse(params);
    return this.makeRequest('/news/search', validatedParams);
  }

  /**
   * Get search suggestions
   * @param params Suggest search parameters
   * @returns Promise resolving to the search suggestions
   */
  async getSuggestions(params: z.infer<typeof SuggestSearchParams>) {
    const validatedParams = SuggestSearchParams.parse(params);
    return this.makeRequest('/suggest/search', validatedParams);
  }

  /**
   * Perform a spellcheck
   * @param params Spellcheck parameters
   * @returns Promise resolving to the spellcheck results
   */
  async spellcheck(params: z.infer<typeof SpellcheckParams>) {
    const validatedParams = SpellcheckParams.parse(params);
    return this.makeRequest('/spellcheck/search', validatedParams);
  }

  /**
   * Get summarizer search results
   * @param params Summarizer search parameters
   * @returns Promise resolving to the summarizer search results
   */
  async summarizerSearch(params: z.infer<typeof SummarizerSearchParams>) {
    const validatedParams = SummarizerSearchParams.parse(params);
    return this.makeRequest('/summarizer/search', validatedParams);
  }
}

/**
 * Create a new instance of the Brave SDK
 * @param options SDK configuration options
 * @returns A new BraveSDK instance
 */
export function createBraveSDK(options: BraveSDKOptions): BraveSDK {
  return new BraveSDK(options);
}

// Export types for better developer experience
export type {
  WebSearchParams,
  ImageSearchParams,
  VideoSearchParams,
  NewsSearchParams,
  SuggestSearchParams,
  SpellcheckParams,
  SummarizerSearchParams,
};
