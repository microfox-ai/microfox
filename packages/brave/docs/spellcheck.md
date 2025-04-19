# spellcheck

The `spellcheck` method performs a spellcheck on the provided query using the Brave Search API.

## Syntax

```typescript
async spellcheck(params: SpellcheckParams): Promise<any>
```

## Parameters

The method accepts a single parameter:

- `params` (required): An object of type `SpellcheckParams` containing the spellcheck request parameters.

### SpellcheckParams

The `SpellcheckParams` object has the following properties:

- `q` (required): A string representing the search query to spellcheck (max 400 characters).
- `country` (optional): A two-letter country code string.
- `lang` (optional): A language code string (e.g., 'en', 'es').

## Return Value

The method returns a Promise that resolves to the API response containing the spellcheck results.

## Usage Example

```typescript
import { createBraveSDK } from 'brave-search-sdk';

const braveSDK = createBraveSDK({
  apiKey: 'your-api-key-here',
});

async function performSpellcheck() {
  try {
    const spellcheckResults = await braveSDK.spellcheck({
      q: 'beleive in yourslef',
      country: 'US',
      lang: 'en',
    });
    console.log('Spellcheck results:', spellcheckResults);
  } catch (error) {
    console.error('Error performing spellcheck:', error);
  }
}

performSpellcheck();
```

## Error Handling

The method uses Zod for input validation. If invalid parameters are provided, a `ZodError` will be thrown. API errors will result in a thrown `Error` with the HTTP status code. It's recommended to wrap the method call in a try-catch block to handle potential errors.

## Notes

- The `q` parameter is required and must not exceed 400 characters.
- The `country` and `lang` parameters can be used to get localized spellcheck results.
- Ensure that you respect the rate limits imposed by the Brave Search API to avoid temporary blocks or account suspension.
- The response will typically include suggestions for corrected spellings of the input query.
- This method is particularly useful for improving search accuracy by correcting common spelling mistakes before performing the actual search.
- The spellcheck feature can enhance the user experience by providing automatic corrections or suggestions for misspelled search terms.
