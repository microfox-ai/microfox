## AI SDK Core

The AI SDK Core is the central part of the AI SDK, providing the core text generation and streaming functionalities. It allows you to interact with language models to generate text, call tools, and stream responses.

### Key Functions

- [`generateText`](#function-generatetext): Generates text and calls tools from a language model.
- [`streamText`](#function-streamtext): Streams text and calls tools from a language model.

---

## Function: `generateText`

Generates text and can optionally call tools using a language model.

### Purpose

This function provides a high-level API for interacting with language models to generate text based on a given prompt. It supports including system messages, providing existing conversation history, and defining tools that the model can use to perform actions.

### Parameters

- `options`: object - Parameters for the text generation.
  - `model`: `LanguageModel` - The language model to use for the generation. (Required)
  - `system`: `string` - An optional system message to guide the model's behavior.
  - `prompt`: `string | Array<ModelMessage>` - The prompt to send to the model. This can be a simple string or an array of messages representing a conversation history. (Required)
  - `tools`: `Record<string, Tool>` - An optional object defining the tools that the model can call.
  - `toolChoice`: `'auto' | 'none' | 'required' | { type: 'tool'; toolName: string }` - Strategy for tool usage. Defaults to `'auto'`.
  - `maxToolRoundtrips`: `number` - The maximum number of tool-call rounds. Defaults to `1`.
  - `onToolCall`: `(toolCall: ToolCallArray<TOOLS>) => Promise<void>` - Optional callback for when a tool is called.
  - `onToolCallResult`: `(toolResult: ToolResultArray<TOOLS>) => Promise<void>` - Optional callback for when a tool call returns a result.
  - `onFinish`: `(result: GenerateTextResult<TOOLS>) => Promise<void>` - Optional callback for when the generation is finished.
  - `...settings`: `CallSettings` - Additional settings like `maxOutputTokens`, `temperature`, etc.

### Return Value

- `Promise<GenerateTextResult<TOOLS>>`: A promise that resolves to an object containing the generation result.
  - `text`: `string` - The generated text.
  - `toolCalls`: `ToolCall[]` - An array of tool calls made by the model.
  - `toolResults`: `ToolResult[]` - An array of results from the tool calls.
  - `finishReason`: `FinishReason` - The reason the generation finished (e.g., 'stop', 'tool-calls').
  - `usage`: `LanguageModelUsage` - Information about token usage.
  - `warnings`: `CallWarning[] | undefined` - Any warnings from the model provider.
  - `rawResponse`: `object | undefined` - The raw response from the provider.
  - `response`: `LanguageModelResponseMetadata` - Metadata about the response.
  - `providerMetadata`: `ProviderMetadata | undefined` - Provider-specific metadata.

### Examples

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Example 1: Basic text generation
const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a cat.',
});
console.log(text);

// Example 2: Using a tool
const { text, toolResults } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'What is the weather in San Francisco?',
  tools: {
    getWeather: {
      description: 'Get the current weather in a location',
      parameters: z.object({ location: z.string() }),
      execute: async ({ location }) => ({
        temperature: 72,
        conditions: 'sunny',
      }),
    },
  },
});
```

---

## Function: `streamText`

Streams text and tool calls from a language model.

### Purpose

Similar to `generateText`, but returns a readable stream of the generation results. This is useful for real-time applications where you want to display the text as it's being generated.

### Parameters

The parameters are the same as for `generateText`.

### Return Value

- `Promise<StreamTextResult<TOOLS>>`: A promise that resolves to an object containing the streamed result. The result object contains a `stream` which is a `ReadableStream<StreamPart<TOOLS>>`.

Each `StreamPart` can be of different types, such as `text-delta`, `tool-call`, `tool-result`, etc.

### Examples

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Example 1: Basic text streaming
const { stream } = await streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a dog.',
});

for await (const part of stream) {
  if (part.type === 'text-delta') {
    process.stdout.write(part.textDelta);
  }
}

// Example 2: Streaming with tools
const { stream, toolCalls } = await streamText({
  model: openai('gpt-4-turbo-preview'),
  prompt: 'What is the weather in London?',
  tools: {
    getWeather: {
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string(),
      }),
    },
  },
});

for await (const part of stream) {
  // ... process stream parts
}
```

---

### Other Core Functions

The AI SDK Core also includes several other functions for different modalities and purposes. These are documented in their respective files:

- `generateObject` / `streamObject`: For generating structured objects (e.g., JSON).
- `embed` / `embedMany`: For creating vector embeddings from text.
- `generateImage`: For generating images.
- `transcribe`: For transcribing audio to text.
- `generateSpeech`: For generating speech from text.

Please refer to the specific documentation for each of these functions for more details.
