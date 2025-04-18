# summarizerSearch

The `summarizerSearch` method retrieves summarized search results using the Brave Search API.

## Syntax

```typescript
async summarizerSearch(params: SummarizerSearchParams): Promise<any>
```

## Parameters

The method accepts a single parameter:

- `params` (required): An object of type `SummarizerSearchParams` containing the summarizer search request parameters.

### SummarizerSearchParams

The `SummarizerSearchParams` object has the following properties:

- `key` (required): A string representing the summarizer key obtained from a previous web search.
- `entity_info` (optional): A boolean to include or exclude entity information in the summary.

## Return Value

The method returns a Promise that resolves to the API response containing the summarized search results.

## Usage Example

```typescript
import { createBraveSDK } from 'brave-search-sdk';

const braveSDK = createBraveSDK({
  apiKey: 'your-api-key-here',
});

async function getSummarizedResults() {
  try {
    // First, perform a web search to get a summarizer key
    const webSearchResults = await braveSDK.webSearch({
      q: 'artificial intelligence',
      count: 1,
    });

    // Extract the summarizer key from the web search results
    const summarizerKey = webSearchResults.summarizer_key;

    // Now use the summarizer key to get summarized results
    const summaryResults = await braveSDK.summarizerSearch({
      key: summarizerKey,
      entity_info: true,
    });
    console.log('Summarized search results:', summaryResults);
  } catch (error) {
    console.error('Error getting summarized results:', error);
  }
}

getSummarizedResults();
```

## Error Handling

The method uses Zod for input validation. If invalid parameters are provided, a `ZodError` will be thrown. API errors will result in a thrown `Error` with the HTTP status code. It's recommended to wrap the method call in a try-catch block to handle potential errors.

## Notes

- The `key` parameter is required and must be obtained from a previous web search result.
- Setting `entity_info` to true will include additional information about entities mentioned in the summary, which can be useful for providing more context.
- The summarizer search is typically used as a follow-up to a web search to get a concise summary of the search results.
- Ensure that you respect the rate limits imposed by the Brave Search API to avoid temporary blocks or account suspension.
- The response will include a summarized version of the search results, which can be particularly useful for quickly understanding the main points of a topic without having to read through multiple search results.
- This feature can greatly enhance the user experience by providing quick, digestible summaries of complex topics.
