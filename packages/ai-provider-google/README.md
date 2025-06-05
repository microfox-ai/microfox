# Google AI Provider

A comprehensive TypeScript SDK for interacting with Google AI's REST API endpoints, enabling seamless integration with various AI models for text generation, embeddings, and image creation.

## Installation

```bash
npm install @microfox/ai-provider-google
```

## Quick Start

```typescript
import { GoogleAiProvider } from '@microfox/ai-provider-google';

// Initialize the provider
const provider = new GoogleAiProvider({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Text Generation Example
const model = provider.languageModel('gemini-2.5-pro-preview-05-06', {
  temperature: 0.7,
  maxOutputTokens: 1024,
  useSearchGrounding: true,
});

const result = await model.generateText({
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});

// Embeddings Example
const embeddingModel = provider.textEmbeddingModel('text-embedding-004');
const embedding = await embeddingModel.generate('Hello, world!');

// Image Generation Example
const imageModel = provider.imageModel(
  'gemini-2.0-flash-preview-image-generation',
);
const images = await imageModel.generate({
  prompt: 'Generate an image of a comic cat',
});
```

## Supported Models

### Language Models

#### Gemini 2.5 Series

- `gemini-2.5-pro-preview-05-06`
- `gemini-2.5-pro-preview-05-06-long-context`
- `gemini-2.5-flash-preview-05-20`
- `gemini-2.5-flash-preview-05-20-thinking`
- `gemini-2.5-flash-preview-native-audio-dialog`
- `gemini-2.5-flash-exp-native-audio-thinking-dialog`
- `gemini-2.5-flash-preview-tts`
- `gemini-2.5-pro-preview-tts`

#### Gemini 2.0 Series

- `gemini-2.0-flash`
- `gemini-2.0-flash-audio`
- `gemini-2.0-flash-live-001`
- `gemini-2.0-flash-live-001-audio`
- `gemini-2.0-flash-lite`
- `gemini-2.0-flash-preview-image-generation`

#### Gemini 1.5 Series

- `gemini-1.5-pro`
- `gemini-1.5-pro-long-context`
- `gemini-1.5-flash`
- `gemini-1.5-flash-long-context`
- `gemini-1.5-flash-8b`
- `gemini-1.5-flash-8b-long-context`

### Embedding Models

- `gemini-embedding-exp`
- `text-embedding-004`
- `embedding-001`

### Image Generation Models

- `gemini-2.0-flash-preview-image-generation`
- `imagen-3.0-generate-002`

## Configuration

### Model Settings

```typescript
interface GoogleChatSettings {
  // Randomness control (0.0 to 1.0)
  temperature?: number;

  // Generation limits
  maxOutputTokens?: number;
  maxInputTokens?: number;

  // Token selection parameters
  topP?: number;
  topK?: number;

  // User identification
  user?: string;

  // Output configuration
  structuredOutputs?: boolean;

  // Safety configuration
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;

  // Search and retrieval
  useSearchGrounding?: boolean;
  dynamicRetrievalConfig?: {
    mode: 'MODE_DYNAMIC' | 'MODE_UNSPECIFIED';
    dynamicThreshold?: number;
  };
}
```

## Error Handling

```typescript
try {
  const response = await model.generateText({
    prompt: 'Hello, world!',
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Google AI API Error:', error.message);
  }
}
```

## Best Practices

1. **Security**

   - Store API keys in environment variables
   - Implement proper error handling
   - Use appropriate model versions

2. **Performance**

   - Consider rate limits and costs
   - Implement caching strategies
   - Choose models based on use case requirements

3. **Development**
   - Test thoroughly in development environment
   - Monitor API usage and costs
   - Keep SDK version up to date

## License

MIT
