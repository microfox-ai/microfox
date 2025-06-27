## Function: `embed`

Generates an embedding for a single value using an embedding model.

### Purpose

To create a vector representation (embedding) of a given value using a specified model. This is useful for semantic similarity comparisons.

### Parameters

- `options`: object
  - `model`: `EmbeddingModel<VALUE>` - The embedding model to use. (Required)
  - `value`: `VALUE` - The value to embed. The type depends on the model. (Required)
  - `providerOptions`: `ProviderOptions` - Optional, provider-specific options.
  - `maxRetries`: `number` - Optional. Maximum number of retries. Defaults to `2`.
  - `abortSignal`: `AbortSignal` - Optional. A signal to cancel the call.
  - `headers`: `Record<string, string>` - Optional. Additional HTTP headers for the request.
  - `experimental_telemetry`: `TelemetrySettings` - Optional. Experimental telemetry configuration.

### Return Value

A `Promise` that resolves to an `EmbedResult<VALUE>` object:

- `value`: `VALUE` - The original value that was embedded.
- `embedding`: `number[]` - The embedding vector.
- `usage`: `{ tokens: number }` - Token usage information.
- `response`: `{ headers?: Record<string, string>; body?: unknown }` - Optional. The raw response from the provider.

### Examples

```typescript
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

// Example 1: Basic usage
const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'sunny day at the beach',
});

// Example 2: With optional parameters
const { embedding: embedding2, usage } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'another sunny day',
  maxRetries: 1,
  headers: { 'X-Custom-Header': 'value' },
});

// Example 3: Using an abort signal
const controller = new AbortController();

const embedPromise = embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'aborted embedding',
  abortSignal: controller.signal,
});

controller.abort();

try {
  await embedPromise;
} catch (e) {
  console.log(e); // AbortError
}
```
