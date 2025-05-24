## Function: `webSearch`

Performs a web search using the Brave Search API.

**Purpose:**
This function allows you to perform web searches and retrieve results from the Brave Search API, including web pages, news, videos, discussions, FAQs, and more.

**Parameters:**

- `params` (WebSearchParams, required): An object containing the search parameters.
  - `q` (string, required): The search query (max 400 characters, 50 words).
  - `country` (string, optional): 2-letter country code. Defaults to 'US'.
  - `search_lang` (string, optional): Search language. Defaults to 'en'.
  - `ui_lang` (string, optional): UI language. Defaults to 'en-US'.
  - `count` (number, optional): Number of results (1-20). Defaults to 20.
  - `offset` (number, optional): Offset for pagination (0-9). Defaults to 0.
  - `safesearch` (enum, optional): Safe search level ('off', 'moderate', 'strict'). Defaults to 'moderate'.
  - `freshness` (enum | string, optional): Freshness of results. Can be:
    - 'pd': Last 24 hours
    - 'pw': Last 7 days
    - 'pm': Last 31 days
    - 'py': Last 365 days
    - Custom date range in format 'YYYY-MM-DDtoYYYY-MM-DD'
  - `text_decorations` (boolean, optional): Include decoration markers. Defaults to true.
  - `spellcheck` (boolean, optional): Enable spellchecking. Defaults to true.
  - `result_filter` (string, optional): Comma-separated list of result types. Available values: discussions, faq, infobox, news, query, summarizer, videos, web, locations.
  - `goggles` (array<string>, optional): Goggle definitions for custom re-ranking.
  - `units` (enum, optional): Units for measurements ('metric', 'imperial').
  - `extra_snippets` (boolean, optional): Include up to 5 additional, alternative excerpts.
  - `summary` (boolean, optional): Enable summary key generation for use with summarizer.

**Return Value:**

- `Promise<WebSearchApiResponse>`: A promise that resolves to the web search response containing:
  - `type`: Always 'web'
  - `discussions`: Optional discussions results
  - `faq`: Optional FAQ results
  - `infobox`: Optional infobox results
  - `locations`: Optional location results
  - `mixed`: Optional mixed results
  - `news`: Optional news results
  - `query`: Query information
  - `rich_data`: Optional rich data
  - `search`: Search results
  - `videos`: Optional video results

**Examples:**

```typescript
// Basic web search
const results = await braveSDK.webSearch({ q: 'TypeScript' });

// Advanced web search with multiple parameters
const results = await braveSDK.webSearch({
  q: 'JavaScript frameworks',
  country: 'US',
  search_lang: 'en',
  count: 15,
  freshness: 'pw',
  safesearch: 'moderate',
  text_decorations: true,
  spellcheck: true,
  result_filter: 'web,news,videos',
  units: 'metric',
  extra_snippets: true,
  summary: true,
});

// Processing the results
if (results.type === 'search') {
  // Access search results
  if (results.web) {
    results.web.results.forEach((result, index) => {
      console.log(`Result ${index + 1}:`, result.title);
      console.log('URL:', result.url);
      console.log('Description:', result.description);
    });
  }

  // Access news results if available
  if (results.news) {
    console.log('News Results:', results.news.results);
  }

  // Access video results if available
  if (results.videos) {
    console.log('Video Results:', results.videos.results);
  }

  // Access FAQ results if available
  if (results.faq) {
    console.log('FAQ Results:', results.faq.results);
  }
}

// Batch web search example
const batchResults = await braveSDK.batchWebSearch([
  { q: 'TypeScript' },
  { q: 'JavaScript', count: 10 },
  { q: 'Python', freshness: 'pw' },
]);

// Process batch results
batchResults.forEach((result, index) => {
  if (result.type === 'web' && result.web) {
    console.log(`Batch ${index + 1} Results:`);
    result.web.results.forEach((searchResult, resultIndex) => {
      console.log(`  Result ${resultIndex + 1}:`, searchResult.title);
      console.log('  URL:', searchResult.url);
    });
  }
});

// Batch search with progress tracking
const batchResultsWithProgress = await braveSDK.batchWebSearch(
  [{ q: 'React' }, { q: 'Vue' }, { q: 'Angular' }],
  {
    delay: 2000, // 2 second delay between requests
    onProgress: (completed, total) => {
      console.log(`Completed ${completed} of ${total} searches`);
    },
  },
);
```
