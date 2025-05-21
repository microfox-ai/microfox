## Function: `newsSearch`

Performs a news search using the Brave Search API.

**Purpose:**
This function allows you to search for news articles using the Brave Search API.

**Parameters:**

- `params` (NewsSearchParams, required): An object containing the search parameters. This is the same as `WebSearchParams` but without the `summary` and `extra_snippets` properties.
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
  - `result_filter` (string, optional): Comma-separated list of result types.
  - `goggles` (array<string>, optional): Goggle definitions for custom re-ranking.
  - `units` (enum, optional): Units for measurements ('metric', 'imperial').

**Return Value:**

- `Promise<NewsSearchApiResponse>`: A promise that resolves to the news search response containing:
  - `type`: Always 'news'
  - `query`: Query information including original, altered, and cleaned versions
  - `results`: Array of news results, each containing:
    - `type`: Always 'news_result'
    - `url`: Article URL
    - `title`: Article title
    - `description`: Article description
    - `age`: Article age
    - `page_age`: Page age
    - `page_fetched`: When the page was fetched
    - `breaking`: Whether it's breaking news
    - `thumbnail`: Thumbnail information
    - `meta_url`: Meta URL information
    - `extra_snippets`: Additional article snippets

**Examples:**

```typescript
// Basic news search
const results = await braveSDK.newsSearch({ q: 'current events' });

// Advanced news search with multiple parameters
const results = await braveSDK.newsSearch({
  q: 'technology news',
  country: 'US',
  search_lang: 'en',
  count: 15,
  freshness: 'pw',
  safesearch: 'moderate',
  text_decorations: true,
  spellcheck: true,
});

// Processing the results
if (results.type === 'news') {
  // Access query information
  console.log('Original query:', results.query.original);
  console.log('Cleaned query:', results.query.cleaned);

  // Process each news result
  results.results.forEach((article, index) => {
    console.log(`\nArticle ${index + 1}:`);
    console.log('Title:', article.title);
    console.log('URL:', article.url);
    console.log('Description:', article.description);
    console.log('Age:', article.age);
    console.log('Breaking News:', article.breaking);

    // Access thumbnail if available
    if (article.thumbnail) {
      console.log('Thumbnail URL:', article.thumbnail.src);
      console.log(
        'Thumbnail dimensions:',
        article.thumbnail.width,
        'x',
        article.thumbnail.height,
      );
    }

    // Access meta URL information if available
    if (article.meta_url) {
      console.log('Source:', article.meta_url.source);
      console.log('Source Domain:', article.meta_url.domain);
    }

    // Access extra snippets if available
    if (article.extra_snippets && article.extra_snippets.length > 0) {
      console.log('Additional snippets:', article.extra_snippets);
    }
  });
}

// Example: Filtering breaking news
const breakingNews = results.results.filter(article => article.breaking);

// Example: Sorting by age
const sortedByAge = results.results.sort((a, b) => {
  const ageA = new Date(a.age).getTime();
  const ageB = new Date(b.age).getTime();
  return ageA - ageB;
});

// Example: Grouping by source
const articlesBySource = results.results.reduce(
  (acc, article) => {
    const source = article.meta_url?.source || 'Unknown';
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(article);
    return acc;
  },
  {} as Record<string, typeof results.results>,
);

// Example: Batch news search
const batchResults = await braveSDK.batchNewsSearch(
  [
    { q: 'technology news', freshness: 'pd' },
    { q: 'sports news', country: 'US', count: 10 },
    { q: 'business news', freshness: 'pw' },
  ],
  {
    delay: 1000, // 1 second delay between requests
    onProgress: (completed, total) => {
      console.log(`Completed ${completed} of ${total} requests`);
    },
  },
);

// Process batch results
batchResults.forEach((result, index) => {
  if ('error' in result) {
    console.error(`Error in request ${index + 1}:`, result.error);
    return;
  }

  console.log(`\nResults for search ${index + 1}:`);
  result.results.forEach((article, articleIndex) => {
    console.log(`\nArticle ${articleIndex + 1}:`);
    console.log('Title:', article.title);
    console.log('Source:', article.meta_url?.source);
    console.log('Age:', article.age);
  });
});
```
