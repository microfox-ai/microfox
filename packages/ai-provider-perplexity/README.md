# Perplexity Provider for Vercel's AI SDK

This package provides a convenient wrapper for using Perplexity's various models through Vercel's AI SDK.

## Installation

```bash
npm install @microfox/ai-provider-perplexity
```

## Usage

### Text Generation

```typescript
import { PerplexityProvider } from '@microfox/ai-provider-perplexity';
import { generateText } from 'ai';

const perplexity = new PerplexityProvider({
  apiKey: process.env.PERPLEXITY_API_KEY!,
});

const { text } = await generateText({
  model: perplexity.languageModel('sonar-pro'),
  prompt: 'Hello, world!',
});

console.log(text);
```

### Streaming Text Generation

```typescript
import { PerplexityProvider } from '@microfox/ai-provider-perplexity';
import { streamText } from 'ai';

const perplexity = new PerplexityProvider({
  apiKey: process.env.PERPLEXITY_API_KEY!,
});

const { textStream } = await streamText({
  model: perplexity.languageModel('sonar-pro'),
  prompt: 'Tell me a story about a futuristic city.',
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
```

## Configuration Options

### PerplexityProvider Options

```typescript
interface PerplexityProviderConfig {
  apiKey: string;
  baseURL?: string;
  headers?: Record<string, string>;
}
```

### Model Options

#### Language Models

- Available models: 'sonar-deep-research', 'sonar-reasoning-pro', 'sonar-reasoning', 'sonar-pro', 'sonar'

## Error Handling

The provider includes built-in error handling for common API issues.

```typescript
try {
  const { text } = await generateText({
    model: perplexity.languageModel('sonar-pro'),
    prompt: 'Hello, world!',
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Perplexity API Error:', error.message);
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
