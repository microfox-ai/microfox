> **Note:** This package is deprecated and will no longer be maintained. Please consider using an alternative.

# Anthropic Provider for Vercel's AI SDK

A TypeScript SDK for interacting with Anthropic's Claude API, providing a convenient wrapper around the official Anthropic SDK.

## Installation

```bash
npm install @microfox/ai-provider-anthropic
```

## Usage

### Text Generation

```typescript
import { AnthropicAiProvider } from '@microfox/ai-provider-anthropic';
import { generateText } from 'ai';

// Initialize the provider with your API key
const anthropic = new AnthropicAiProvider({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Use the language model
const { text } = await generateText({
  model: anthropic.languageModel('claude-3-opus-20240229'),
  prompt: 'Hello, world!',
});

console.log(text);
```

### Streaming Text Generation

```typescript
import { AnthropicAiProvider } from '@microfox/ai-provider-anthropic';
import { streamText } from 'ai';

const anthropic = new AnthropicAiProvider({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const { textStream } = await streamText({
  model: anthropic.languageModel('claude-3-opus-20240229'),
  prompt: 'Tell me a story about a robot who dreams of becoming a chef.',
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
```

## Configuration Options

### AnthropicProvider Options

```typescript
interface AnthropicAiProviderConfig {
  apiKey: string;
  baseURL?: string;
  headers?: Record<string, string>;
}
```

### Model Options

You can pass model-specific options to the `generateText` and `streamText` functions.

#### Language Models

- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`
- `claude-2.1`
- `claude-2.0`
- `claude-instant-1.2`

Additional settings like `maxTokens`, `temperature`, `topP`, `topK`, and `stopSequences` can be passed as parameters.

## Error Handling

The provider includes built-in error handling for common API issues.

```typescript
try {
  const { text } = await generateText({
    model: anthropic.languageModel('claude-3-opus-20240229'),
    prompt: 'Hello, world!',
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Anthropic API Error:', error.message);
  }
}
```

## Best Practices

1.  **Security**: Always store your API key in environment variables.
2.  **Error Handling**: Implement proper error handling for API calls.
3.  **Model Selection**: Use appropriate model versions for your use case.
4.  **Rate-limiting**: Be mindful of rate limits and potential costs.
5.  **Caching**: Implement caching strategies for production environments to improve performance and reduce costs.

## License

MIT
