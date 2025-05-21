# Brave Search API: Image Search

The `imageSearch` function enables image search capabilities through the Brave Search API, allowing you to find and retrieve images based on search queries.

## Function Signature

```typescript
imageSearch(params: ImageSearchParams): Promise<ImageSearchApiResponse>
```

## Parameters

The function accepts a single parameter object with the following properties:

### Required Parameters

- `q` (string): The search query
  - Maximum length: 400 characters
  - Maximum words: 50

### Optional Parameters

- `country` (string): Two-letter country code (e.g., 'US', 'GB')
- `search_lang` (string): Language for search results
- `ui_lang` (string): Language for user interface elements
- `count` (number): Number of results to return (maximum: 20)
- `offset` (number): Pagination offset (maximum: 9)
- `safesearch` (enum): Content filtering level
  - Values: 'off' | 'moderate' | 'strict'
- `freshness` (enum | string): Result freshness filter
  - Preset values: 'pd' (past day), 'pw' (past week), 'pm' (past month), 'py' (past year)
  - Custom string values also supported
- `text_decorations` (boolean): Include text decoration markers in results
- `spellcheck` (boolean): Enable automatic spell checking
- `result_filter` (string): Comma-separated list of result types to include
- `goggles` (string[]): Array of goggle definitions
- `units` (enum): Measurement units
  - Values: 'metric' | 'imperial'

## Return Value

Returns a Promise that resolves to an `ImageSearchApiResponse` object containing the search results.

### Response Type Structure

```typescript
interface ImageSearchApiResponse {
  query: {
    original: string;
    show_strict_warning: boolean;
    is_navigational: boolean;
    is_news_breaking: boolean;
    spellcheck_off: boolean;
    country: string;
    bad_results: boolean;
    should_fallback: boolean;
    postal_code: string;
    city: string;
    header_country: string;
    more_results_available: boolean;
    state: string;
  };
  mixed: {
    type: string;
    main: ImageResult[];
  };
  type: string;
}

interface ImageResult {
  title: string;
  url: string;
  source: string;
  source_favicon: string;
  source_domain: string;
  thumbnail: {
    src: string;
    original: string;
    width: number;
    height: number;
  };
  size: {
    width: number;
    height: number;
  };
  age: string;
  type: string;
  description: string;
  family_friendly: boolean;
}
```

## Example Usage

```typescript
// Basic image search
const results = await braveSDK.imageSearch({
  q: 'cats',
  count: 10,
  safesearch: 'moderate',
});

// Advanced image search with multiple parameters
const results = await braveSDK.imageSearch({
  q: 'sunset beach',
  country: 'US',
  search_lang: 'en',
  count: 15,
  freshness: 'pw',
  safesearch: 'strict',
  units: 'metric',
});

// Processing the results
const processResults = async () => {
  try {
    const response = await braveSDK.imageSearch({ q: 'landscape' });

    // Access the image results
    const images = response.mixed.main;

    // Process each image
    images.forEach(image => {
      console.log(`Title: ${image.title}`);
      console.log(`Source: ${image.source}`);
      console.log(`Image URL: ${image.url}`);
      console.log(`Thumbnail: ${image.thumbnail.src}`);
      console.log(`Dimensions: ${image.size.width}x${image.size.height}`);
      console.log(`Description: ${image.description}`);
    });

    // Check if more results are available
    if (response.query.more_results_available) {
      console.log('More results are available');
    }

    // Get query metadata
    console.log(`Original query: ${response.query.original}`);
    console.log(`Country: ${response.query.country}`);
  } catch (error) {
    console.error('Error performing image search:', error);
  }
};
```

## Notes

- The function is similar to `webSearch` but specifically optimized for image results
- Results are paginated using the `count` and `offset` parameters
- Safe search is enabled by default with 'moderate' level
- All parameters except `q` are optional

## Best Practices

1. **Error Handling**

   - Always wrap API calls in try-catch blocks
   - Handle rate limiting and network errors appropriately

2. **Result Processing**

   - Check for `more_results_available` before attempting to fetch more results
   - Use the `thumbnail` property for preview images
   - Consider the `family_friendly` flag when filtering results
   - Use `size` information to filter by image dimensions

3. **Performance**

   - Use appropriate `count` values to avoid over-fetching
   - Implement pagination using `offset` for large result sets
   - Cache results when appropriate

4. **Image Quality**
   - Use `size` information to ensure images meet your requirements
   - Consider using `freshness` parameter for time-sensitive content
   - Use `safesearch` to filter inappropriate content
