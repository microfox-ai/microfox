# Brave TypeScript SDK

This TypeScript SDK provides a convenient way to interact with the Brave Search API. It includes functions for web search, image search, video search, news search, suggestions, spellcheck, and summarizer search.

## Installation

```bash
npm install brave-search-sdk
```

## Usage

First, import the SDK and create an instance:

```typescript
import { createBraveSDK } from 'brave-search-sdk';

const braveSDK = createBraveSDK({
  apiKey: 'your-api-key-here',
});
```

### Web Search

```typescript
const webSearchResults = await braveSDK.webSearch({
  q: 'brave search',
  country: 'US',
  count: 10,
});
console.log(webSearchResults);
```

### Image Search

```typescript
const imageSearchResults = await braveSDK.imageSearch({
  q: 'cute cats',
  count: 20,
  safesearch: 'moderate',
});
console.log(imageSearchResults);
```

### Video Search

```typescript
const videoSearchResults = await braveSDK.videoSearch({
  q: 'funny videos',
  count: 15,
  freshness: 'pw',
});
console.log(videoSearchResults);
```

### News Search

```typescript
const newsSearchResults = await braveSDK.newsSearch({
  q: 'technology news',
  count: 10,
  extra_snippets: true,
});
console.log(newsSearchResults);
```

### Get Suggestions

```typescript
const suggestions = await braveSDK.getSuggestions({
  q: 'how to',
  count: 5,
  rich: true,
});
console.log(suggestions);
```

### Spellcheck

```typescript
const spellcheckResults = await braveSDK.spellcheck({
  q: 'beleive',
  country: 'US',
});
console.log(spellcheckResults);
```

### Summarizer Search

```typescript
const summarizerResults = await braveSDK.summarizerSearch({
  key: 'summarizer-key-from-web-search',
  entity_info: true,
});
console.log(summarizerResults);
```

## API Reference

### `createBraveSDK(options: BraveSDKOptions): BraveSDK`

Creates a new instance of the Brave SDK.

- `options.apiKey` (required): Your Brave Search API key.
- `options.baseUrl` (optional): The base URL for the Brave Search API. Defaults to 'https://api.search.brave.com/res/v1'.

### `BraveSDK` Methods

All methods return a Promise that resolves to the API response.

- `webSearch(params: WebSearchParams)`
- `imageSearch(params: ImageSearchParams)`
- `videoSearch(params: VideoSearchParams)`
- `newsSearch(params: NewsSearchParams)`
- `getSuggestions(params: SuggestSearchParams)`
- `spellcheck(params: SpellcheckParams)`
- `summarizerSearch(params: SummarizerSearchParams)`

## Error Handling

The SDK uses Zod for input validation. If invalid parameters are provided, a `ZodError` will be thrown. API errors will result in a thrown `Error` with the HTTP status code.

## Authentication

To use this SDK, you need to obtain an API key from the Brave Search API dashboard. Once you have your API key, pass it to the `createBraveSDK` function as shown in the usage example above.

## Rate Limiting

Be aware of the rate limits imposed by the Brave Search API. Exceeding these limits may result in temporary blocks or account suspension. Refer to the official Brave Search API documentation for the most up-to-date information on rate limits.

## License

This SDK is released under the MIT License.
