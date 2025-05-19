## Function: `embedMany`

Embeds several values using an embedding model. The function automatically splits large requests into smaller chunks if the model has a limit on how many embeddings can be generated in a single call. The type of the value is defined by the embedding model.

**Purpose:**

This function is used to generate embeddings for multiple values using a specified embedding model. Embeddings are numerical representations of text or other data, useful for tasks like similarity search, clustering, and classification.

**Parameters:**

- `model`: EmbeddingModel - **Required**. The embedding model to use. Example: `openai.embedding('text-embedding-3-small')`. This parameter expects a function that returns an object with a `model` property (string) and optionally a `provider` property.
- `values`: array<VALUE> - **Required**. The values to embed. The type depends on the model (e.g., array<string> for text embeddings).
- `maxRetries?`: number - Optional. Maximum number of retries. Set to 0 to disable retries. Default: 2.
- `abortSignal?`: AbortSignal - Optional. An optional abort signal that can be used to cancel the call.
- `headers?`: Record<string, string> - Optional. Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.
- `experimental_telemetry?`: TelemetrySettings - Optional. Telemetry configuration. Experimental feature.

**TelemetrySettings:**

- `isEnabled?`: boolean - Optional. Enable or disable telemetry. Disabled by default while experimental.
- `recordInputs?`: boolean - Optional. Enable or disable input recording. Enabled by default.
- `recordOutputs?`: boolean - Optional. Enable or disable output recording. Enabled by default.
- `functionId?`: string - Optional. Identifier for this function. Used to group telemetry data by function.
- `metadata?`: Record<string, string | number | boolean | array<null | undefined | string> | array<null | undefined | number> | array<null | undefined | boolean>> - Optional. Additional information to include in the telemetry data.

**Return Value:**

An object with the following properties:

- `values`: array<VALUE> - The original values that were embedded. The type VALUE corresponds to the input `values` type.
- `embeddings`: array<array<number>> - The embeddings. They are in the same order as the input `values`. Each embedding is an array of numbers.
- `usage`: EmbeddingTokenUsage - The token usage for generating the embeddings.

**EmbeddingTokenUsage:**

- `tokens`: number - The total number of input tokens used.

**Examples:**

```typescript
// Example 1: Minimal usage with required arguments
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { embedMany } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const { embeddings, values } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});

console.log('Embedded values:', values);
console.log('Embeddings:', embeddings);

// Example 2: With optional arguments
const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
  maxRetries: 5,
  headers: {
    'X-Custom-Header': 'value',
  },
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'embedMany-test',
    metadata: {
      user_id: '123',
    },
  },
});

console.log('Embeddings:', embeddings);

// Example 3: Handling AbortSignal
const controller = new AbortController();
const signal = controller.signal;

setTimeout(() => {
  controller.abort();
}, 100); // Abort after 100ms

try {
  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: ['sunny day at the beach', 'rainy afternoon in the city'],
    abortSignal: signal,
  });
  console.log('Embeddings:', embeddings);
} catch (error) {
  console.error('Request aborted:', error);
}
```
