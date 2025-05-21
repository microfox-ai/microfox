## Function: `generateObject`

Generates a typed, structured object for a given prompt and schema using a language model. It can be used to force the language model to return structured data, suitable for tasks like information extraction, synthetic data generation, or classification.

**Purpose:**

This function enables developers to extract structured data from language model responses. By providing a schema, the function ensures the output conforms to the desired structure, simplifying downstream processing and integration. It supports various output types including objects, arrays, enums, and schema-less JSON.

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

**Return Value:**

An object with the following properties:

- `object`: **based on the schema** - The generated object, validated against the provided schema if applicable.

- `finishReason`: **'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'** - The reason the model stopped generating.

- `usage`: **CompletionTokenUsage** - Token usage information.

  - **CompletionTokenUsage**:
    - `promptTokens`: **number** - Number of prompt tokens.
    - `completionTokens`: **number** - Number of completion tokens.
    - `totalTokens`: **number** - Total tokens used.

- `request`: **RequestMetadata | undefined** - Request metadata.

  - **RequestMetadata**:
    - `body`: **string** - Raw request body.

- `response`: **ResponseMetadata | undefined** - Response metadata.

  - **ResponseMetadata**:
    - `id`: **string** - Response ID.
    - `modelId`: **string** - Model ID.
    - `timestamp`: **Date** - Response timestamp.
    - `headers`: **Record<string, string> | undefined** - Response headers.
    - `body`: **unknown | undefined** - Response body.

- `warnings`: **array<Warning> | undefined** - Warnings from the provider.

- `providerMetadata`: **Record<string, Record<string, JSONValue>> | undefined** - Provider metadata.

- `toJsonResponse`: **(init?: ResponseInit) => Response** - Function to convert the object to a JSON response.

**Examples:**

```ts
import { generateObject } from 'ai';
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { z } from 'zod';

// Initialize the provider
const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Example 1: Generate a simple object with schema
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

const { object: user } = await generateObject({
  model: openai.languageModel('gpt-4'),
  schema: userSchema,
  prompt:
    'Generate a user profile for a 25-year-old software engineer named John.',
});

// Example 2: Generate an array of objects
const { object: users } = await generateObject({
  model: openai.languageModel('gpt-4'),
  output: 'array',
  schema: userSchema,
  prompt: 'Generate 3 user profiles for software engineers.',
});

// Example 3: Generate an enum value
const { object: category } = await generateObject({
  model: openai.languageModel('gpt-4'),
  output: 'enum',
  enum: ['fiction', 'non-fiction', 'biography', 'science'],
  prompt: 'What category would "The Art of War" by Sun Tzu belong to?',
});

// Example 4: Generate schema-less JSON
const { object: data } = await generateObject({
  model: openai.languageModel('gpt-4'),
  output: 'no-schema',
  mode: 'json',
  prompt:
    'Generate a JSON object describing a book with title, author, and publication year.',
});

// Example 5: Using messages array
const { object: response } = await generateObject({
  model: openai.languageModel('gpt-4'),
  schema: userSchema,
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant that generates user profiles.',
    },
    { role: 'user', content: 'Create a profile for a data scientist.' },
  ],
});
```
