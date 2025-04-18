# webSearch

The `webSearch` method performs a web search using the Brave Search API.

## Syntax

```typescript
async webSearch(params: WebSearchParams): Promise<any>
```

## Parameters

The method accepts a single parameter:

- `params` (required): An object of type `WebSearchParams` containing the search parameters.

### WebSearchParams

The `WebSearchParams` object has the following properties:

- `q` (required): A string representing the search query (max 400 characters).
- `country` (optional): A two-letter country code string.
- `search_lang` (optional): A language code string (e.g., 'en', 'es').
- `ui_lang` (optional): A UI language code string (e.g., 'en-US').
- `count` (optional): A number between 1 and 20 representing the number of results to return.
- `offset` (optional): A number between 0 and 9 representing the offset for pagination.
- `safesearch` (optional): A string enum ('off', 'moderate', 'strict') for SafeSearch option.
- `freshness` (optional): A string enum ('pd', 'pw', 'pm', 'py') or a date range string for result freshness.
- `text_decorations` (optional): A boolean to enable or disable text decorations.
- `spellcheck` (optional): A boolean to enable or disable spellcheck.

## Return Value

The method returns a Promise that resolves to the API response containing the web search results.

## Usage Example

```typescript
import { createBraveSDK } from 'brave-search-sdk';

const braveSDK = createBraveSDK({
  apiKey: 'your-api-key-here',
});

async function performWebSearch() {
  try {
    const results = await braveSDK.webSearch({
      q: 'Brave Search API',
      country: 'US',
      count: 10,
      safesearch: 'moderate',
      freshness: 'pw',
    });
    console.log('Web search results:', results);
  } catch (error) {
    console.error('Error performing web search:', error);
  }
}

performWebSearch();
```

## Error Handling

The method uses Zod for input validation. If invalid parameters are provided, a `ZodError` will be thrown. API errors will result in a thrown `Error` with the HTTP status code. It's recommended to wrap the method call in a try-catch block to handle potential errors.

## Notes

- The `q` parameter is required and must not exceed 400 characters.
- The `count` parameter is limited to a maximum of 20 results per request.
- The `offset` parameter can be used for pagination, with a maximum value of 9.
- The `freshness` parameter accepts predefined values ('pd' for past day, 'pw' for past week, 'pm' for past month, 'py' for past year) or a custom date range in the format 'YYYY-MM-DDtoYYYY-MM-DD'.
- Ensure that you respect the rate limits imposed by the Brave Search API to avoid temporary blocks or account suspension.
