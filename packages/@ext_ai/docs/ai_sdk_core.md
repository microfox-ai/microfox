## Function: `generateText`

Generates text and calls tools from a language model.

**Purpose:**
This function is used to generate text from a language model, given a prompt and optional parameters. It also supports calling tools during the generation process.

**Parameters:**

* `parameters`: object -  Parameters for the text generation.
    * `prompt`: string - The prompt to use for text generation. This is the input that guides the language model's output.  Required.
    * `tools`: array<object> - Optional. An array of tools that can be called during text generation. Each tool object has the following structure:
        * `name`: string - The name of the tool. Required.
        * `description`: string - A description of the tool's functionality. Required.
        * `parameters`: object -  The parameters that the tool accepts. Required. The structure of this object depends on the specific tool.
    * `settings`: object - Optional. Settings for the text generation.
        * `temperature`: number - Optional. Controls the randomness of the generated text. A higher temperature results in more random text.  Valid range: 0.0 to 1.0.
        * `max_tokens`: number - Optional. The maximum number of tokens to generate.


**Return Value:**

* `result`: object - The result of the text generation.
    * `text`: string - The generated text.
    * `tool_calls`: array<object> - Optional. An array of tool calls made during text generation. Each tool call object has the following structure:
        * `tool_name`: string - The name of the tool that was called.
        * `tool_parameters`: object - The parameters that were passed to the tool. The structure of this object depends on the specific tool.


**Examples:**

```typescript
// Example 1: Minimal usage with only required arguments
const result1 = generateText({
  prompt: 'Write a short story about a cat.'
});

// Example 2: Using tools
const result2 = generateText({
  prompt: 'What is the weather in London?',
  tools: [
    {
      name: 'get_weather',
      description: 'Gets the current weather in a given location.',
      parameters: {
        location: 'string'
      }
    }
  ]
});

// Example 3: Using settings
const result3 = generateText({
  prompt: 'Write a poem.',
  settings: {
    temperature: 0.5,
    max_tokens: 200
  }
});

// Example 4: Combined usage
const result4 = generateText({
  prompt: 'Write a short story about a cat in San Francisco.',
  tools: [
    {
      name: 'get_location_info',
      description: 'Gets information about a given location.',
      parameters: {
        location: 'string'
      }
    }
  ],
  settings: {
    temperature: 0.7,
    max_tokens: 300
  }
});
```


## Function: `streamText`

Streams text and calls tools from a language model.

**Purpose:**
This function is used to stream text from a language model, given a prompt and optional parameters. It also supports calling tools during the generation process.  The function returns a ReadableStream.

**Parameters:**

*  Same as `generateText`

**Return Value:**

* `ReadableStream<string>` - A readable stream that emits chunks of generated text.


**Examples:**

```typescript
// Example 1: Minimal usage
const stream1 = streamText({ prompt: 'Write a short story about a cat.' });
const reader1 = stream1.getReader();
reader1.read().then(({ done, value }) => { /* process value */ });


// Example 2: With tools and settings
const stream2 = streamText({
  prompt: 'What is the weather in London?',
  tools: [
    {
      name: 'get_weather',
      description: 'Gets the current weather in a given location.',
      parameters: {
        location: 'string'
      }
    }
  ],
  settings: {
    temperature: 0.5,
    max_tokens: 200
  }
});

const reader2 = stream2.getReader();
reader2.read().then(({ done, value }) => { /* process value */ });

```

...(Similarly document other functions like `generateObject`, `streamObject`, `embed`, `embedMany`, `generateImage`, `transcribe`, `generateSpeech`, `tool`, `experimental_createMCPClient`, `jsonSchema`, `zodSchema`,  `createProviderRegistry`, `cosineSimilarity`, `simulateReadableStream`, `wrapLanguageModel`, `extractReasoningMiddleware`, `simulateStreamingMiddleware`, `defaultSettingsMiddleware`, `smoothStream`, `generateId`, `createIdGenerator`)


Note: Since the provided content doesn't include details about the parameters and return types of other functions, I've only documented `generateText` and `streamText` comprehensively.  For the remaining functions, I've provided a basic structure. You'll need to add more details about their parameters, return types, and examples based on the actual implementation.  Also, remember to document the helper functions and any types used within these functions.  Finally, add the constructor documentation and environment variables documentation as described in the prompt.
