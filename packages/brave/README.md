# Brave SDK

TypeScript SDK for Brave Search APIs.

## Installation

```bash
npm install @microfox/brave
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `BRAVE_API_KEY`: Your Brave Search API key. Obtain this by subscribing to a plan (including the free plan) at https://brave.com/search/api/. **(Required)**

## Quick Start

```typescript
import { createBraveSDK } from '@microfox/brave';

// Initialize with API key
const braveSDK = createBraveSDK({
  apiKey: process.env.BRAVE_API_KEY,
});

// Or use environment variable
const braveSDK = createBraveSDK(); // Uses BRAVE_API_KEY from environment
```

## Batch Requests ( DO NOT USE PROMISE.All )

- Free Plan Ratelimit: 1 request per second
- Pro Plan Ratelimit: 20 requests per second

When making multiple requests, use sequential processing instead to avoid hitting rate limits,
generally using a `await new Promise(resolve => setTimeout(resolve, 1000))` is a good patternt o delay in bettween requests.

```typescript
const queries = ['search query 1', 'search query 2'];

// ❌ Don't do this ( Promise.all will hit 429 due to rate limiting. )
const contentPromises = userTopics.topics.map(async topic => {
  const results = await braveSDK.webSearch({ q: topic, count: 5 });
  return results.search?.results || [];
});
const contentResults = await Promise.all(contentPromises);

// ✅ Do this instead ( use batchWebSearch )
const contentResults = await braveSdk.batchWebSearch(
  userTopics.topics.map(topic => ({
    q: topic,
    count: 5,
  })),
); // deafault delay of 1 second

// ✅ or Do this instead
const contentResults = [];
for (const topic of topics) {
  const results = await braveSDK.webSearch({ q: topic, count: 5 });
  await new Promise(resolve => setTimeout(resolve, 1000)); // delay by 1 seconds
  contentResults.push({ query: topic, results: results.search?.results });
}
```

## API Reference

For detailed documentation on all available functions and their parameters, please refer to the following files:

- [request](./docs/request.md)
- [webSearch](./docs/webSearch.md)
- [localPoiSearch](./docs/localPoiSearch.md)
- [localDescriptionsSearch](./docs/localDescriptionsSearch.md)
- [summarizerSearch](./docs/summarizerSearch.md)
- [imageSearch](./docs/imageSearch.md)
- [videoSearch](./docs/videoSearch.md)
- [newsSearch](./docs/newsSearch.md)
- [suggestSearch](./docs/suggestSearch.md)
- [spellcheckSearch](./docs/spellcheckSearch.md)
- [createBraveSDK](./docs/createBraveSDK.md)

## Best Practices

1. Always use sequential processing for multiple requests to respect rate limits
2. Handle API errors appropriately
3. Consider caching responses when appropriate
4. Monitor rate limit headers in responses for quota management
