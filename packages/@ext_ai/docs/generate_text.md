## Function: `generateText`

Generates text and calls tools for a given prompt using a language model. It is ideal for non-interactive use cases such as automation tasks where you need to write text (e.g., drafting emails or summarizing web pages) and for agents that use tools.

**Purpose:**

This function provides a way to generate text using a specified language model, given a prompt and optional parameters like system instructions, conversation history, and available tools. It supports multi-step conversations and tool calling, making it suitable for complex interactions and automated workflows.

**Parameters:**

- `model`: LanguageModel (required) - The language model to use. This parameter specifies the provider and model name (e.g., `openai('gpt-4o')`). This parameter is required.

- `system`: string (optional) - The system prompt to use that specifies the behavior of the model. This provides high-level instructions to guide the model's responses.

- `prompt`: string (optional) - The input prompt to generate the text from. This is the main input that triggers the text generation. Either `prompt` or `messages` must be provided.

- `messages`: Array<CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage> | Array<UIMessage> (optional) - A list of messages that represent a conversation. Automatically converts UI messages from the `useChat` hook. Either `prompt` or `messages` must be provided. The different message types are defined below:

  - **CoreSystemMessage:**

    - `role`: 'system' (required)
    - `content`: string (required) - The content of the system message.

  - **CoreUserMessage:**

    - `role`: 'user' (required)
    - `content`: string | Array<TextPart | ImagePart | FilePart> (required) - The content of the user message.
      - **TextPart:**
        - `type`: 'text' (required)
        - `text`: string (required) - The text content.
      - **ImagePart:**
        - `type`: 'image' (required)
        - `image`: string | Uint8Array | Buffer | ArrayBuffer | URL (required) - The image content. Strings can be base64 encoded content, base64 data URLs, or http(s) URLs.
        - `mimeType`: string (optional) - The MIME type of the image.
      - **FilePart:**
        - `type`: 'file' (required)
        - `data`: string | Uint8Array | Buffer | ArrayBuffer | URL (required) - The file content. Strings can be base64 encoded content, base64 data URLs, or http(s) URLs.
        - `mimeType`: string (required) - The MIME type of the file.

  - **CoreAssistantMessage:**

    - `role`: 'assistant' (required)
    - `content`: string | Array<TextPart | ReasoningPart | RedactedReasoningPart | ToolCallPart> (required) - The content of the assistant message.
      - **TextPart:**
        - `type`: 'text' (required)
        - `text`: string (required) - The text content.
      - **ReasoningPart:**
        - `type`: 'reasoning' (required)
        - `text`: string (required) - The reasoning text.
        - `signature`: string (optional) - The signature for the reasoning.
      - **RedactedReasoningPart:**
        - `type`: 'redacted-reasoning' (required)
        - `data`: string (required) - The redacted data.
      - **ToolCallPart:**
        - `type`: 'tool-call' (required)
        - `toolCallId`: string (required) - The ID of the tool call.
        - `toolName`: string (required) - The name of the tool.
        - `args`: object (required) - Parameters for the tool, based on the tool's Zod schema.

  - **CoreToolMessage:**
    - `role`: 'tool' (required)
    - `content`: Array<ToolResultPart> (required) - The content of the tool message.
      - **ToolResultPart:**
        - `type`: 'tool-result' (required)
        - `toolCallId`: string (required) - The ID of the tool call.
        - `toolName`: string (required) - The name of the tool.
        - `result`: unknown (required) - The result returned by the tool.
        - `isError`: boolean (optional) - Indicates if the result is an error.

- `tools`: ToolSet (optional) - Tools that are accessible to and can be called by the model. Each tool is defined as follows:

  - `description`: string (optional) - Description of the tool's purpose.
  - `parameters`: Zod Schema | JSON Schema (required) - The schema of the tool's input parameters.
  - `execute`: async (parameters: T, options: ToolExecutionOptions) => RESULT (optional) - An asynchronous function that executes the tool.
    - The `options` parameter of the `execute` function includes:
      - `toolCallId`: string (required)
      - `messages`: CoreMessage[] (required)
      - `abortSignal`: AbortSignal (optional)

- `toolChoice`: "auto" | "none" | "required" | { "type": "tool", "toolName": string } (optional) - Controls tool selection. Defaults to "auto".

- `maxTokens`: number (optional) - Maximum number of tokens to generate.

- `temperature`: number (optional) - Temperature setting for controlling randomness.

- `topP`: number (optional) - Nucleus sampling, alternative to temperature.

- `topK`: number (optional) - Samples from the top K options.

- `presencePenalty`: number (optional) - Penalty for repeating information.

- `frequencyPenalty`: number (optional) - Penalty for repeating words/phrases.

- `stopSequences`: string[] (optional) - Sequences to stop generation.

- `seed`: number (optional) - Seed for deterministic results.

- `maxRetries`: number (optional) - Maximum retries. Defaults to 2.

- `abortSignal`: AbortSignal (optional) - Abort signal for cancellation.

- `headers`: Record<string, string> (optional) - Additional HTTP headers.

- `maxSteps`: number (optional) - Maximum number of LLM calls. Defaults to 1.

- `experimental_generateMessageId`: () => string (optional) - Function to generate message IDs.

- `experimental_continueSteps`: boolean (optional) - Enables continue steps. Defaults to false.

- `experimental_telemetry`: TelemetrySettings (optional) - Telemetry configuration.

  - `isEnabled`: boolean (optional) - Enables telemetry. Defaults to false.
  - `recordInputs`: boolean (optional) - Enables input recording. Defaults to true.
  - `recordOutputs`: boolean (optional) - Enables output recording. Defaults to true.
  - `functionId`: string (optional) - Function identifier for telemetry.
  - `metadata`: Record<string, any> (optional) - Additional telemetry metadata.

- `providerOptions`: Record<string, Record<string, JSONValue>> (optional)- Provider-specific options.

- `experimental_activeTools`: Array<string> (optional) - List of active tools.

- `experimental_repairToolCall`: (options: ToolCallRepairOptions) => Promise<LanguageModelV1FunctionToolCall | null> (optional) - Function to repair failed tool calls.

- `experimental_output`: Output (optional) - Experimental setting for structured outputs.

  - `text()`: Output - Forwards text output.
  - `object()`: Output - Generates a JSON object. Requires a `schema` parameter.

- `onStepFinish`: (result: OnStepFinishResult) => Promise<void> | void (optional) - Callback for step completion.
  - The `result` parameter of the `onStepFinish` callback includes:
    - `stepType`: "initial" | "continue" | "tool-result" (required)
    - `finishReason`: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown" (required)
    - `usage`: TokenUsage (required)
      - `promptTokens`: number (required)
      - `completionTokens`: number (required)
      - `totalTokens`: number (required)
    - `text`: string (required)
    - `toolCalls`: ToolCall[] (required)
    - `toolResults`: ToolResult[] (required)
    - `warnings`: Warning[] (optional)
    - `response`: Response (optional)
      - `id`: string (required)
      - `model`: string (required)
      - `timestamp`: Date (required)
      - `headers`: Record<string, string> (optional)
      - `body`: unknown (optional)
      - `isContinued`: boolean (required)
      - `providerMetadata`: Record<string, Record<string, JSONValue>> (optional)
    - `isContinued`: boolean (required)

**Return Value:**

An object with the following properties:

- `text`: string (required) - The generated text.
- `reasoning`: string (optional) - Reasoning text from the model.
- `reasoningDetails`: Array<ReasoningDetail> (required) - Detailed reasoning information. Each `ReasoningDetail` can have a `type` of 'text' or 'redacted'.
- `sources`: Array<Source> (required) - Sources used in generation.
- `files`: Array<GeneratedFile> (required) - Generated files.
- `toolCalls`: array (required) - Tool calls made by the model.
- `toolResults`: array (required) - Results from tool calls.
- `finishReason`: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown' (required) - Reason for generation completion.
- `usage`: CompletionTokenUsage (required) - Token usage information.
- `request`: RequestMetadata (optional) - Request metadata.
- `response`: ResponseMetadata (optional) - Response metadata.
- `messages`: Array<ResponseMessage> (required) - Response messages.
- `warnings`: Warning[] (optional) - Warnings from the provider.
- `experimental_output`: Output (optional) - Experimental structured output.
- `steps`: Array<StepResult> (required) - Information about each step in the generation process.

**Examples:**

```typescript
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { generateText } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Example 1: Minimal usage with only required arguments
const { text } = await generateText({
  model: openai.languageModel('gpt-4o'),
  prompt: 'Invent a new holiday and describe its traditions.'
});

console.log(text);


// Example 2: Using system prompt and messages
const { text: text2, steps } = await generateText({
  model: openai.languageModel('gpt-4o'),
  system: 'You are a helpful assistant.',
  messages: [
    { role: 'user', content: 'What are some fun activities for a rainy day?' }
  ]
});

console.log(text2);
console.log(steps);


// Example 3: Using tools
import { z } from 'zod';

const tools = {
  'getWeather': {
    description: 'Gets the current weather in a given location.',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => {
      // Replace with actual weather API call
      return { condition: 'rainy', temperature: 60 };
    }
  }
};


const { text: text3, toolCalls } = await generateText({
  model: openai.languageModel('gpt-4o'),
  prompt: 'What's the weather like in London?',
  tools
});

console.log(text3);
console.log(toolCalls);


// Example 4: Error handling
try {
  const result = await generateText({
    model: openai.languageModel('gpt-4o'),
    prompt: 'This is a very long prompt that exceeds the maximum token limit.',
    maxTokens: 10
  });
} catch (error) {
  console.error('Error generating text:', error);
}

```
