# getSuggestions

The `getSuggestions` method retrieves search suggestions using the Brave Search API.

## Syntax

```typescript
async getSuggestions(params: SuggestSearchParams): Promise<any>
```

## Parameters

The method accepts a single parameter:

- `params` (required): An object of type `SuggestSearchParams` containing the suggestion request parameters.

### SuggestSearchParams

The `SuggestSearchParams` object has the following properties:

- `q` (required): A string representing the search query (max 400 characters).
- `country` (optional): A two-letter country code string.
- `lang` (optional): A language code string (e.g., 'en', 'es').
- `count` (optional): A number between 1 and 20 representing the number of suggestions to return.
- `rich` (optional): A boolean to enable or disable rich suggestions.

## Return Value

The method returns a Promise that resolves to the API response containing the search suggestions.

## Usage Example

```typescript
import { createBraveSDK } from 'brave-search-sdk';

const braveSDK = createBraveSDK({
  apiKey: 'your-api-key-here',
});

async function getSearchSuggestions() {
  try {
    const suggestions = await braveSDK.getSuggestions({
      q: 'how to',
      country: 'US',
      lang: 'en',
      count: 5,
      rich: true,
    });
    console.log('Search suggestions:', suggestions);
  } catch (error) {
    console.error('Error getting search suggestions:', error);
  }
}

getSearchSuggestions();
```

## Error Handling

The method uses Zod for input validation. If invalid parameters are provided, a `ZodError` will be thrown. API errors will result in a thrown `Error` with the HTTP status code. It's recommended to wrap the method call in a try-catch block to handle potential errors.

## Notes

- The `q` parameter is required and must not exceed 400 characters.
- The `count` parameter is limited to a maximum of 20 suggestions per request.
- Setting `rich` to true will include additional information in the suggestions, which can be useful for displaying more context or visual elements.
- The `country` and `lang` parameters can be used to get localized suggestions.
- Ensure that you respect the rate limits imposed by the Brave Search API to avoid temporary blocks or account suspension.
- The response will include an array of suggested search queries based on the input query.
- This method is particularly useful for implementing autocomplete functionality in search interfaces.
