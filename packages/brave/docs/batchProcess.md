# Batch Processing

The batch processing functionality allows you to process multiple requests sequentially with configurable delays and progress tracking. This is particularly useful for handling rate limits and managing multiple API calls efficiently.

## Overview

The `batchProcess` method is a core functionality that supports various types of batch operations:

- Web searches
- Image searches
- Video searches
- News searches
- Suggest searches
- Spellcheck searches
- Summarizer searches
- Local POI searches
- Local descriptions searches

## Usage

### Basic Usage

```typescript
const results = await braveSDK.batchProcess([
  { type: 'web', params: { q: 'TypeScript' } },
  { type: 'image', params: { q: 'cats' } },
  { type: 'news', params: { q: 'technology' } },
]);
```

### With Options

```typescript
const results = await braveSDK.batchProcess(
  [
    { type: 'web', params: { q: 'React' } },
    { type: 'web', params: { q: 'Vue' } },
    { type: 'web', params: { q: 'Angular' } },
  ],
  {
    delay: 2000, // 2 second delay between requests
    onProgress: (completed, total) => {
      console.log(`Completed ${completed} of ${total} requests`);
    },
  },
);
```

## Convenience Methods

The SDK provides convenience methods for common batch operations:

### Batch Web Search

```typescript
const results = await braveSDK.batchWebSearch([
  { q: 'TypeScript' },
  { q: 'JavaScript' },
  { q: 'Python' },
]);
```

### Batch Image Search

```typescript
const results = await braveSDK.batchImageSearch([
  { q: 'cats', count: 5 },
  { q: 'dogs', count: 5 },
]);
```

### Batch Video Search

```typescript
const results = await braveSDK.batchVideoSearch([
  { q: 'tutorials', count: 5 },
  { q: 'reviews', count: 5 },
]);
```

### Batch News Search

```typescript
const results = await braveSDK.batchNewsSearch([
  { q: 'technology', freshness: 'pd' },
  { q: 'sports', country: 'US' },
]);
```

## Options

The `BatchRequestOptions` interface provides the following configuration options:

- `delay` (number, optional): Delay between requests in milliseconds. Default: 1000ms
- `onProgress` (function, optional): Callback function that receives progress updates
  - Parameters:
    - `completed`: Number of completed requests
    - `total`: Total number of requests

## Error Handling

The batch process handles errors gracefully:

- If a request fails, it will be included in the results with an error property
- The process continues with the next request
- All results are returned in the same order as the input requests

```typescript
const results = await braveSDK.batchProcess(requests);
results.forEach((result, index) => {
  if ('error' in result) {
    console.error(`Request ${index + 1} failed:`, result.error);
  } else {
    // Process successful result
  }
});
```

## Best Practices

1. **Rate Limiting**

   - Use appropriate delays between requests to respect API rate limits
   - Free Plan: 1 request per second
   - Pro Plan: 20 requests per second

2. **Progress Tracking**

   - Implement the `onProgress` callback to monitor batch processing
   - Use this for updating UI or logging progress

3. **Error Handling**

   - Always check for errors in the results
   - Implement appropriate error recovery strategies

4. **Resource Management**

   - Consider the total number of requests in a batch
   - Implement pagination or chunking for large batches
   - Cache results when appropriate

5. **Type Safety**
   - Use TypeScript's type system to ensure correct request types and parameters
   - Leverage the provided convenience methods for type-safe batch operations

## Examples

### Complex Batch Processing

```typescript
const batchRequests = [
  { type: 'web', params: { q: 'TypeScript', count: 10 } },
  { type: 'image', params: { q: 'cats', safesearch: 'moderate' } },
  { type: 'news', params: { q: 'technology', freshness: 'pw' } },
  { type: 'video', params: { q: 'tutorials', count: 5 } },
];

const results = await braveSDK.batchProcess(batchRequests, {
  delay: 1500,
  onProgress: (completed, total) => {
    const percentage = (completed / total) * 100;
    console.log(`Progress: ${percentage.toFixed(1)}%`);
  },
});

// Process results
results.forEach((result, index) => {
  if ('error' in result) {
    console.error(`Request ${index + 1} failed:`, result.error);
    return;
  }

  switch (batchRequests[index].type) {
    case 'web':
      console.log('Web results:', result.search?.results);
      break;
    case 'image':
      console.log('Image results:', result.mixed?.main);
      break;
    case 'news':
      console.log('News results:', result.results);
      break;
    case 'video':
      console.log('Video results:', result.results);
      break;
  }
});
```
