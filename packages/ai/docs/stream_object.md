## Function: `streamObject`

Streams a typed, structured object from a prompt using a language model. It ensures the model's output conforms to a provided schema.

### Purpose

To reliably stream structured data (JSON) from a language model. By providing a Zod or JSON schema, you can enforce the output structure and process the object as it is being generated.

### Parameters

- `options`: object
  - `model`: `LanguageModel` - The language model to use. (Required)
  - `schema`: `z.Schema` or `JSONSchema` - The schema that describes the object's shape. (Required)
  - `mode`: `'auto' | 'json' | 'tool'` - Optional. The mode for object generation. Defaults to `'auto'`.
  - `system`: `string` - Optional. A system prompt to guide the model.
  - `prompt`: `string` - Optional. The user prompt.
  - `messages`: `ModelMessage[]` - Optional. An array of messages for conversation history.
  - `onFinish`: `(result: { object: T; ... }) => Promise<void>` - Optional callback for when the generation is finished.
  - `...settings`: `CallSettings` - Optional settings like `temperature`, `maxRetries`, etc.

### Return Value

A `Promise` that resolves to a `StreamObjectResult<T>` object, where `T` is the inferred type from the schema:

- `partialObjectStream`: `ReadableStream<DeepPartial<T>>` - A stream of partial objects as they are being generated.
- `elementStream`: `ReadableStream<E>` - If the schema is an array, this stream provides the elements of the array as they are generated.
- `textStream`: `ReadableStream<string>` - A stream of the raw JSON text.
- `fullStream`: `ReadableStream<ObjectStreamPart<T>>` - A stream of all events, including partial objects, errors, and finish events.
- `object`: `Promise<T>` - A promise that resolves to the final, validated object.
- `finishReason`: `Promise<FinishReason>` - A promise that resolves to the reason the generation finished.
- `usage`: `Promise<LanguageModelUsage>` - A promise that resolves to the token usage information.
- `response`: `Promise<LanguageModelResponseMetadata>` - A promise that resolves to the response metadata.
- `toTextStreamResponse(init?: ResponseInit)`: `Response` - A function to create a JSON `Response` object, useful for serverless functions.

### Examples

```typescript
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Example 1: Stream a simple object
const { partialObjectStream, object } = await streamObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    name: z.string(),
    age: z.number(),
  }),
  prompt: 'Generate a user profile for a 25-year-old named John.',
});

for await (const partial of partialObjectStream) {
  console.log(partial);
}

// Example 2: Stream an array of objects
const { elementStream, object: users } = await streamObject({
  model: openai('gpt-4-turbo'),
  schema: z.array(z.object({ name: z.string() })),
  prompt: 'Generate 3 names for a new startup.',
});

for await (const element of elementStream) {
  console.log(element);
}
```
