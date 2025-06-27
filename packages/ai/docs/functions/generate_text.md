## Function: `generateText`

Generates text and calls tools from a language model. This function is ideal for non-interactive use cases such as automation, content generation, and agents that use tools.

### Purpose

To generate text from a language model based on a given prompt. It supports system messages, conversation history, and tool calls, making it suitable for a wide range of applications.

### Parameters

- `model`: **LanguageModel** (required)
  - The language model to use for text generation.
- `system`: **string** (optional)
  - The system prompt that guides the model's behavior.
- `prompt`: **string | Array<UserMessage | AssistantMessage | ToolMessage>** (optional)
  - The prompt for the model. It can be a simple string, or an array of user, assistant, and tool messages.
- `tools`: **Record<string, Tool>** (optional)
  - A set of tools that the model can call.
- `toolChoice`: **'auto' | 'none' | 'required' | { type: 'tool'; toolName: string }** (optional)
  - The strategy for tool usage. Defaults to `'auto'`.
- `maxToolRoundtrips`: **number** (optional)
  - The maximum number of tool-call rounds. Defaults to `1`.
- and other optional settings like `temperature`, `maxTokens`, etc.

### Return Value

A `Promise` that resolves to a `GenerateTextResult` object:

- `text`: `string` - The generated text.
- `toolCalls`: `ToolCall[]` - An array of tool calls that the model has made.
- `toolResults`: `ToolResult[]` - An array of results from the tool calls.
- `finishReason`: `FinishReason` - The reason the generation finished.
- `usage`: `LanguageModelUsage` - Token usage information.
- `warnings`: `CallWarning[] | undefined` - Any warnings from the provider.
- `rawResponse`: `object | undefined` - The raw response from the provider.

### Examples

```typescript
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Example 1: Basic text generation
const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Invent a new holiday and describe its traditions.',
});

// Example 2: Using a system prompt and conversation history
const { text: text2 } = await generateText({
  model: openai('gpt-4-turbo'),
  system: 'You are a friendly assistant.',
  prompt: [
    {
      role: 'user',
      content: 'What are some fun activities to do in San Francisco?',
    },
    {
      role: 'assistant',
      content:
        "You can visit the Golden Gate Bridge, Alcatraz Island, or Fisherman's Wharf.",
    },
    { role: 'user', content: 'Which of those is best for a sunny day?' },
  ],
});

// Example 3: Using tools
const { text: text3, toolResults } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: "What's the weather like in San Francisco?",
  tools: {
    getWeather: tool({
      description: 'Get the current weather',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for.'),
      }),
      execute: async ({ city }) => ({
        city,
        temperature: 72,
        conditions: 'sunny',
      }),
    }),
  },
});
```
