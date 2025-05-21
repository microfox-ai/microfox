## Function: `embed`

Generate an embedding for a single value using an embedding model. This is ideal for use cases where you need to embed a single value to, for example, retrieve similar items or to use the embedding in a downstream task.

**Purpose:**
Creates an embedding vector representation of a given value using a specified embedding model. This allows for comparing semantic similarity between different values by comparing their embedding vectors.

**Parameters:**

- `model`: EmbeddingModel (required)
  - The embedding model to use.
  - Example: `openai.embedding('text-embedding-3-small')`
- `value`: VALUE (required)
  - The value to embed. The type depends on the model. Can be a string, number, or other data type supported by the model.
- `maxRetries?`: number (optional)
  - Maximum number of retries. Set to 0 to disable retries.
  - Default: 2
- `abortSignal?`: AbortSignal (optional)
  - An optional abort signal that can be used to cancel the call.
- `headers?`: Record<string, string> (optional)
  - Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.
- `experimental_telemetry?`: TelemetrySettings (optional)

  - Telemetry configuration. Experimental feature.

  - **`TelemetrySettings` Object:**
    - `isEnabled?`: boolean
      - Enable or disable telemetry. Disabled by default while experimental.
    - `recordInputs?`: boolean
      - Enable or disable input recording. Enabled by default.
    - `recordOutputs?`: boolean
      - Enable or disable output recording. Enabled by default.
    - `functionId?`: string
      - Identifier for this function. Used to group telemetry data by function.
    - `metadata?`: Record<string, string | number | boolean | Array<null | undefined | string> | Array<null | undefined | number> | Array<null | undefined | boolean>>
      - Additional information to include in the telemetry data.

**Return Value:**

- Object with the following properties:

  - `value`: VALUE
    - The value that was embedded. This is the same as the input `value`.
  - `embedding`: array<number>
    - The embedding of the value as an array of numbers.
  - `usage`: EmbeddingTokenUsage

    - The token usage for generating the embeddings.

  - **`EmbeddingTokenUsage` Object:**
    - `tokens`: number
      - The total number of input tokens.
  - `rawResponse?`: RawResponse (optional)

    - Optional raw response data.

  - **`RawResponse` Object:**
    - `headers?`: Record<string, string>
      - Response headers.

**Examples:**

```typescript
// Example 1: Minimal usage with required arguments
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { embed } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'sunny day at the beach',
});

// Example 2: With optional arguments
const { embedding, usage } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'another sunny day',
  maxRetries: 1,
  headers: { 'X-Custom-Header': 'value' },
  experimental_telemetry: { isEnabled: true },
});

// Example 3: With abort signal
const controller = new AbortController();
const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'aborted embedding',
  abortSignal: controller.signal,
});

controller.abort();
```
