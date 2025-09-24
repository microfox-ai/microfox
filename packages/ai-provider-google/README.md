> **Note:** This package is deprecated and will no longer be maintained. Please consider using an alternative.

# Google AI Provider for Vercel's AI SDK

A comprehensive TypeScript SDK for interacting with Google AI's REST API endpoints, enabling seamless integration with various AI models for text generation, embeddings, and image creation.

## Installation

```bash
npm install @microfox/ai-provider-google
```

## Usage

### Text Generation

```typescript
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { generateText } from 'ai';

// Initialize the provider
const provider = new GoogleAiProvider({
  apiKey: process.env.GOOGLE_API_KEY!,
});

const { text } = await generateText({
  model: provider.languageModel('gemini-1.5-pro'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});

console.log(text);
```

### Text Embedding

```typescript
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { embed } from 'ai';

const provider = new GoogleAiProvider({
  apiKey: process.env.GOOGLE_API_KEY!,
});

const { embedding } = await embed({
  model: provider.textEmbeddingModel('text-embedding-004'),
  value: 'Hello, world!',
});

console.log(embedding);
```

### Image Generation

```typescript
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { generateImage } from 'ai';

const provider = new GoogleAiProvider({
  apiKey: process.env.GOOGLE_API_KEY!,
});

const { imageUrl } = await generateImage({
  model: provider.imageModel('imagen-3.0-generate-002'),
  prompt: 'A comic book style cat dreaming of code.',
});

console.log(imageUrl);
```

## Configuration Options

### GoogleAiProvider Options

```typescript
interface GoogleAiProviderConfig {
  apiKey: string;
  headers?: Record<string, string>;
}
```

### Model Options

You can pass model-specific options to the `generateText` and `generateImage` functions.

#### Language Models

- `gemini-2.5-pro-preview-05-06`
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- and others.

Additional settings like `temperature`, `maxOutputTokens`, `topP`, `topK`, `safetySettings` can be passed.

#### Embedding Models

- `text-embedding-004`
- `embedding-001`

#### Image Generation Models

- `imagen-3.0-generate-002`
- `gemini-2.0-flash-preview-image-generation`

## Error Handling

The provider includes built-in error handling for common API issues.

```typescript
try {
  const { text } = await generateText({
    model: provider.languageModel('gemini-1.5-pro'),
    prompt: 'Hello, world!',
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Google AI API Error:', error.message);
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
