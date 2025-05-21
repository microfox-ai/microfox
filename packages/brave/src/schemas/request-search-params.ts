import { z } from 'zod';

export const WebSearchParamsSchema = z
  .object({
    q: z
      .string()
      .max(400)
      .describe(
        "The user's search query term. Query can not be empty. Maximum of 400 characters and 50 words in the query.",
      ),
    country: z
      .string()
      .length(2)
      .optional()
      .default('US')
      .describe(
        'The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries.',
      ),
    search_lang: z
      .string()
      .optional()
      .default('en')
      .describe(
        'The search language preference. The 2 or more character language code for which the search results are provided.',
      ),
    ui_lang: z
      .string()
      .optional()
      .default('en-US')
      .describe(
        "User interface language preferred in response. Usually of the format '<language_code>-<country_code>'.",
      ),
    count: z
      .number()
      .min(1)
      .max(20)
      .optional()
      .default(20)
      .describe(
        'The number of search results returned in response. The maximum is 20. The actual number delivered may be less than requested. Combine this parameter with offset to paginate search results.',
      ),
    offset: z
      .number()
      .min(0)
      .max(9)
      .optional()
      .default(0)
      .describe(
        'The zero based offset that indicates number of search results per page (count) to skip before returning the result. The maximum is 9. The actual number delivered may be less than requested based on the query.',
      ),
    safesearch: z
      .enum(['off', 'moderate', 'strict'])
      .optional()
      .default('moderate')
      .describe(
        'Filters search results for adult content. off: No filtering is done. moderate: Filters explicit content, like images and videos, but allows adult domains in the search results. strict: Drops all adult content from search results.',
      ),
    freshness: z
      .union([
        z.enum(['pd', 'pw', 'pm', 'py']),
        z.string().regex(/^\d{4}-\d{2}-\d{2}to\d{4}-\d{2}-\d{2}$/),
      ])
      .optional()
      .describe(
        'Filters search results by when they were discovered. pd: Discovered within the last 24 hours. pw: Discovered within the last 7 Days. pm: Discovered within the last 31 Days. py: Discovered within the last 365 Days. YYYY-MM-DDtoYYYY-MM-DD: timeframe is also supported by specifying the date range.',
      ),
    text_decorations: z
      .boolean()
      .optional()
      .default(true)
      .describe(
        'Whether display strings (e.g. result snippets) should include decoration markers (e.g. highlighting characters).',
      ),
    spellcheck: z
      .boolean()
      .optional()
      .default(true)
      .describe(
        'Whether to spellcheck provided query. If the spellchecker is enabled, the modified query is always used for search. The modified query can be found in altered key from the query response model.',
      ),
    result_filter: z
      .string()
      .optional()
      .describe(
        'A comma delimited string of result types to include in the search response. Available values: discussions, faq, infobox, news, query, summarizer, videos, web, locations.',
      ),
    goggles: z
      .array(z.string())
      .optional()
      .describe(
        "Goggles act as a custom re-ranking on top of Brave's search index. The parameter supports both a url where the Goggle is hosted or the definition of the goggle.",
      ),
    units: z
      .enum(['metric', 'imperial'])
      .optional()
      .describe(
        'The measurement units. If not provided, units are derived from search country. metric: The standardized measurement system. imperial: The British Imperial system of units.',
      ),
    extra_snippets: z
      .boolean()
      .optional()
      .describe(
        'A snippet is an excerpt from a page you get as a result of the query, and extra_snippets allow you to get up to 5 additional, alternative excerpts.',
      ),
    summary: z
      .boolean()
      .optional()
      .describe(
        'This parameter enables summary key generation in web search results. This is required for summarizer to be enabled.',
      ),
  })
  .describe('Parameters for web search');

export const LocalSearchParamsSchema = z
  .object({
    ids: z.array(z.string()).max(20).describe('List of location IDs (max 20)'),
    search_lang: z.string().optional().describe('Search language'),
    ui_lang: z.string().optional().describe('UI language'),
    units: z.enum(['metric', 'imperial']).optional(),
  })
  .describe('Parameters for local search');

export type WebSearchParams = z.infer<typeof WebSearchParamsSchema>;
export type LocalSearchParams = z.infer<typeof LocalSearchParamsSchema>;
