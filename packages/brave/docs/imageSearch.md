# imageSearch

The `imageSearch` method performs an image search using the Brave Search API.

## Syntax

```typescript
async imageSearch(params: ImageSearchParams): Promise<any>
```

## Parameters

The method accepts a single parameter:

- `params` (required): An object of type `ImageSearchParams` containing the search parameters.

### ImageSearchParams

The `ImageSearchParams` object has the following properties:

- `q` (required): A string representing the search query (max 400 characters).
- `country` (optional): A two-letter country code string.
- `search_lang` (optional): A language code string (e.g., 'en', 'es').
- `count` (optional): A number between 1 and 100 representing the number of results to return.
- `safesearch` (optional): A string enum ('off', 'moderate', 'strict') for SafeSearch option.
- `spellcheck` (optional): A boolean to enable or disable spellcheck.

## Return Value

The method returns a Promise that resolves to the API response containing the image search results.

## Usage Example

```typescript
import { createBraveSDK } from 'brave-search-sdk';

const braveSDK = createBraveSDK({
  apiKey: 'your-api-key-here',
});

async function performImageSearch() {
  try {
    const results = await braveSDK.imageSearch({
      q: 'cute cats',
      country: 'US',
      count: 20,
      safesearch: 'moderate',
    });
    console.log('Image search results:', results);
  } catch (error) {
    console.error('Error performing image search:', error);
  }
}

performImageSearch();
```

## Error Handling

The method uses Zod for input validation. If invalid parameters are provided, a `ZodError` will be thrown. API errors will result in a thrown `Error` with the HTTP status code. It's recommended to wrap the method call in a try-catch block to handle potential errors.

## Notes

- The `q` parameter is required and must not exceed 400 characters.
- The `count` parameter is limited to a maximum of 100 results per request.
- The `safesearch` option can be used to filter out potentially inappropriate images.
- Ensure that you respect the rate limits imposed by the Brave Search API to avoid temporary blocks or account suspension.
- The response will include metadata about the images, such as thumbnails, original URLs, and dimensions.
