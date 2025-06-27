## Function: `generateObject`

Generates a typed, structured object from a prompt using a language model. It ensures the model's output conforms to a provided schema.

### Purpose

To reliably extract structured data (JSON) from language model responses. By providing a Zod or JSON schema, you can enforce the output structure, which is ideal for tasks like information extraction, data generation, or classification.

### Parameters

- `options`: object
  - `model`: `LanguageModel` - The language model to use. (Required)
  - `schema`: `z.Schema` or `JSONSchema` - The schema that describes the object's shape. This is used to guide the model and validate its output. (Required)
  - `mode`: `'auto' | 'json' | 'tool'` - Optional. The mode for object generation. Defaults to `'auto'`. Not all models support all modes.
  - `system`: `string` - Optional. A system prompt to guide the model.
  - `prompt`: `string` - Optional. The user prompt.
  - `messages`: `ModelMessage[]` - Optional. An array of messages for conversation history.
  - ...other `CallSettings`: Optional settings like `temperature`, `maxRetries`, etc.

**Parameters:**

- `model`: **LanguageModel** (required) - The language model to use. Example: `openai('gpt-4-turbo')`. This parameter specifies the underlying language model provider and model name. It assumes a function like `openai` is available in the scope.

- `output`: **'object' | 'array' | 'enum' | 'no-schema' | undefined** (optional) - The type of output to generate. Defaults to `'object'`. This parameter controls the structure of the generated output. `'object'` generates a single object matching the schema. `'array'` generates an array of objects matching the schema. `'enum'` generates a single string value from the provided `enum` list. `'no-schema'` generates JSON without schema validation.

- `mode`: **'auto' | 'json' | 'tool'** (optional) - The mode to use for object generation. Not every model supports all modes. Defaults to `'auto'` for `'object'` output and to `'json'` for `'no-schema'` output. Must be `'json'` for `'no-schema'` output. This parameter influences how the language model generates the structured data.

- `schema`: **Zod Schema | JSON Schema** (optional) - The schema that describes the shape of the object to generate. It is sent to the model to guide generation and used to validate the output. You can either pass in a Zod schema or a JSON schema (using the `jsonSchema` function). In `'array'` mode, the schema describes an array element. Not available with `'no-schema'` or `'enum'` output.

- `schemaName`: **string | undefined** (optional) - Optional name of the output. Used by some providers for additional LLM guidance. Not available with `'no-schema'` or `'enum'` output.

- `schemaDescription`: **string | undefined** (optional) - Optional description of the output. Used by some providers for additional LLM guidance. Not available with `'no-schema'` or `'enum'` output.

- `enum`: **array<string>** (optional) - List of possible values to generate. Only available with `'enum'` output.

- `system`: **string** (optional) - The system prompt to guide the model's behavior.

- `prompt`: **string** (optional) - The input prompt to generate the object from.

- `messages`: **Array<CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage> | Array<UIMessage>** (optional) - A list of messages representing a conversation. Automatically converts UI messages from the `useChat` hook (not defined in provided code). The structure of each message type is detailed below:

  - **CoreSystemMessage**:

    - `role`: **'system'** - The role of the message.
    - `content`: **string** - The content of the message.

  - **CoreUserMessage**:

    - `role`: **'user'** - The role of the message.
    - `content`: **string | Array<TextPart | ImagePart | FilePart>** - The content of the message. `TextPart`, `ImagePart`, and `FilePart` are defined below:
      - **TextPart**:
        - `type`: **'text'** - The type of message part.
        - `text`: **string** - The text content.
      - **ImagePart**:
        - `type`: **'image'** - The type of message part.
        - `image`: **string | Uint8Array | Buffer | ArrayBuffer | URL** - The image content. Strings can be base64 encoded content, base64 data URLs, or http(s) URLs.
        - `mimeType`: **string | undefined** - The MIME type of the image.
      - **FilePart**:
        - `type`: **'file'** - The type of message part.
        - `data`: **string | Uint8Array | Buffer | ArrayBuffer | URL** - The file content. Strings can be base64 encoded content, base64 data URLs, or http(s) URLs.
        - `mimeType`: **string** - The MIME type of the file.

  - **CoreAssistantMessage**:

    - `role`: **'assistant'** - The role of the message.
    - `content`: **string | Array<TextPart | ReasoningPart | RedactedReasoningPart | ToolCallPart>** - The content of the message. `ReasoningPart`, `RedactedReasoningPart`, and `ToolCallPart` are defined below:
      - **TextPart**: (Same as in CoreUserMessage)
      - **ReasoningPart**:
        - `type`: **'reasoning'** - The type of message part.
        - `text`: **string** - The reasoning text.
        - `signature`: **string | undefined** - The signature for the reasoning.
      - **RedactedReasoningPart**:
        - `type`: **'redacted-reasoning'** - The type of message part.
        - `data`: **string** - The redacted data.
      - **ToolCallPart**:
        - `type`: **'tool-call'** - The type of message part.
        - `toolCallId`: **string** - The ID of the tool call.
        - `toolName`: **string** - The name of the tool.
        - `args`: **object** - Parameters for the tool call (based on schema).

  - **CoreToolMessage**:
    - `role`: **'tool'** - The role of the message.
    - `content`: **Array<ToolResultPart>** - The content of the message. `ToolResultPart` is defined below:
      - **ToolResultPart**:
        - `type`: **'tool-result'** - The type of message part.
        - `toolCallId`: **string** - The ID of the tool call.
        - `toolName`: **string** - The name of the tool.
        - `result`: **unknown** - The result returned by the tool.
        - `isError`: **boolean | undefined** - Whether the result is an error.

- `maxTokens`: **number | undefined** (optional) - Maximum number of tokens to generate.

- `temperature`: **number | undefined** (optional) - Temperature setting for the language model.

- `topP`: **number | undefined** (optional) - Nucleus sampling setting for the language model.

- `topK`: **number | undefined** (optional) - Top-K sampling setting for the language model.

- `presencePenalty`: **number | undefined** (optional) - Presence penalty setting for the language model.

- `frequencyPenalty`: **number | undefined** (optional) - Frequency penalty setting for the language model.

- `seed`: **number | undefined** (optional) - Random seed for deterministic generation.

- `maxRetries`: **number | undefined** (optional) - Maximum number of retries. Default: 2.

- `abortSignal`: **AbortSignal | undefined** (optional) - Abort signal for cancelling the request.

- `headers`: **Record<string, string> | undefined** (optional) - Additional HTTP headers.

- `experimental_repairText`: **(options: RepairTextOptions) => Promise<string> | undefined** (optional) - Experimental function to repair the model's raw output for JSON parsing.

  - **RepairTextOptions**:
    - `text`: **string** - The generated text.
    - `error`: **JSONParseError | TypeValidationError** - The parsing error.

- `experimental_telemetry`: **TelemetrySettings | undefined** (optional) - Experimental telemetry settings.

  - **TelemetrySettings**:
    - `isEnabled`: **boolean | undefined** - Enables/disables telemetry.
    - `recordInputs`: **boolean | undefined** - Enables/disables input recording.
    - `recordOutputs`: **boolean | undefined** - Enables/disables output recording.
    - `functionId`: **string | undefined** - Function identifier for telemetry.
    - `metadata`: **Record<string, string | number | boolean | Array<null | undefined | string> | Array<null | undefined | number> | Array<null | undefined | boolean>> | undefined** - Additional telemetry metadata.

- `providerOptions`: **Record<string, Record<string, JSONValue>> | undefined** (optional) - Provider-specific options.

### Return Value

A `Promise` that resolves to a `GenerateObjectResult<T>` object, where `T` is the inferred type from the schema:

- `object`: `T` - The generated and validated object.
- `finishReason`: `FinishReason` - The reason the generation finished.
- `usage`: `LanguageModelUsage` - Token usage information.
- `warnings`: `CallWarning[] | undefined` - Any warnings from the provider.
- `rawResponse`: `object | undefined` - The raw response from the provider.
- `response`: `LanguageModelResponseMetadata` - Metadata about the response.
- `providerMetadata`: `ProviderMetadata | undefined` - Provider-specific metadata.
- `toJsonResponse(init?: ResponseInit)`: `Response` - A function to create a JSON `Response` object, useful for serverless functions.

### Examples

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Example 1: Generate a simple object
const { object: user } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    name: z.string(),
    age: z.number(),
  }),
  prompt: 'Generate a user profile for a 25-year-old named John.',
});

// Example 2: Generate an array of objects
const { object: users } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
    }),
  ),
  prompt: 'Generate 3 user profiles for a new startup.',
});

// Example 3: Generate an enum value
const { object: category } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.enum(['fiction', 'non-fiction', 'biography', 'poetry']),
  prompt: 'What category does "The Lord of the Rings" belong to?',
});

// Example 4: Using messages for conversation history
const { object: response } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    city: z.string(),
    weather: z.string(),
  }),
  messages: [
    { role: 'system', content: 'You are a helpful weather bot.' },
    { role: 'user', content: 'What is the weather in San Francisco?' },
  ],
});
```
