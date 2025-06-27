## Function: `embedMany`

Embeds an array of values using an embedding model. It automatically handles splitting large requests into smaller chunks if the model has a limit.

### Purpose

To generate embeddings for multiple values at once, which is efficient for tasks like batch processing documents for similarity search.

### Parameters

- `options`: object
  - `model`: `EmbeddingModel<VALUE>` - The embedding model to use. (Required)
  - `values`: `VALUE[]` - The array of values to embed. (Required)
  - `providerOptions`: `ProviderOptions` - Optional, provider-specific options.
  - `maxRetries`: `number` - Optional. Maximum number of retries. Defaults to `2`.
  - `abortSignal`: `AbortSignal` - Optional. A signal to cancel the call.
  - `headers`: `Record<string, string>` - Optional. Additional HTTP headers for the request.
  - `experimental_telemetry`: `TelemetrySettings` - Optional. Experimental telemetry configuration.

### Return Value

A `Promise` that resolves to an `EmbedManyResult<VALUE>` object:

- `values`: `VALUE[]` - The original values that were embedded.
- `embeddings`: `number[][]` - An array of embedding vectors, in the same order as the input values.
- `usage`: `{ tokens: number }` - Token usage information.
- `responses`: `Array<{ headers?: Record<string, string>; body?: unknown }>` - Optional. The raw responses from the provider.

### Examples

```typescript
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

// Example 1: Basic usage
const { embeddings, values } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});

// Example 2: With optional parameters
const { embeddings: embeddings2 } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['more sunny days', 'more rainy afternoons'],
  maxRetries: 3,
  headers: { 'X-Another-Header': 'value' },
});

// Example 3: Using an abort signal
const controller = new AbortController();

const embedPromise = embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['a', 'b', 'c'],
  abortSignal: controller.signal,
});

controller.abort();

try {
  await embedPromise;
} catch (e) {
  console.log(e); // AbortError
}
```
