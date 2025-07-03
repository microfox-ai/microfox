## Function: `tool`

Creates a tool definition for use with language models. This function primarily serves to improve TypeScript type inference for the `execute` method of a tool, connecting the `parameters` schema to the arguments of the `execute` function. It doesn't have runtime behavior beyond constructing the tool object.

**Purpose:**

Facilitates the definition of tools and improves type safety when using tools with language models. By defining the `parameters` schema, the `tool` function enables TypeScript to infer the correct types for the arguments passed to the `execute` function. This helps prevent runtime errors and improves developer experience.

**Parameters:**

- **`tool`**: (object, required) The tool definition object.
  - **`description`**: (string, optional) A description of the tool's purpose, including details on how and when it can be used by the language model.
  - **`parameters`**: (Zod Schema or JSON Schema, required) Defines the schema of the input expected by the tool. The language model uses this schema to generate input and validate its output. Use clear descriptions within the schema to help the language model understand the input. You can provide either a Zod schema or a JSON schema (using the `jsonSchema` function).
  - **`execute`**: (async function, optional) An asynchronous function that's called with the arguments from the tool call and returns a result. The function signature is `async (parameters: T, options: ToolExecutionOptions) => RESULT`, where `T` is the type inferred from the `parameters` schema, and `RESULT` is the return type of the `execute` function. If not provided, the tool will not be executed automatically.
    - **`parameters`**: (object, required) The parameters passed to the tool, validated against the provided schema.
    - **`options`**: (ToolExecutionOptions object, required) Additional options for tool execution.
      - **`toolCallId`**: (string, required) The ID of the tool call. This can be used, for example, when sending tool-call related information with stream data.
      - **`messages`**: (array&lt;ModelMessage&gt;, required) Messages sent to the language model to initiate the response containing the tool call. This excludes the system prompt and the assistant response containing the tool call.
      - **`abortSignal`**: (AbortSignal, optional) An abort signal to indicate that the operation should be aborted.
  - **`render`**: (async function, optional) A function that returns a React node to be rendered in the UI. This is useful for displaying tool results in a user-friendly way.

**Return Value:**

The `tool` function returns the tool definition object that was passed in as a parameter. This allows for chaining or further manipulation of the tool definition.

**Examples:**

```typescript
import { tool } from 'ai';
import { z } from 'zod';

// Example 1: Basic tool definition
const myTool = tool({
  description: 'Gets the current time.',
  parameters: z.object({}), // No parameters
  execute: async () => {
    const now = new Date();
    return { time: now.toISOString() };
  },
});

// Example 2: Tool with parameters and Zod validation
const weatherTool = tool({
  description: 'Get the weather in a location',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }, { toolCallId }) => {
    console.log(`Tool call ID: ${toolCallId}`);
    return {
      location,
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    };
  },
});
```
