# Anthropic Provider

A TypeScript SDK for interacting with Anthropic's Claude API, providing a convenient wrapper around the official Anthropic SDK.

## Installation

```bash
npm install @microfox/ai-provider-anthropic
```

## Usage

### Basic Usage

```typescript
import { AnthropicAiProvider } from '@microfox/ai-provider-anthropic';

// Initialize the provider with your API key
const provider = new AnthropicAiProvider({
  apiKey: 'YOUR_API_KEY_HERE',
});

// Use the language model
const response = await provider
  .languageModel('claude-3-opus-20240229')
  .generate({
    prompt: 'Hello, world!',
  });

console.log(response.text);
```

### Streaming

```typescript
const stream = await provider.languageModel('claude-3-opus-20240229').stream({
  prompt: 'Tell me a story',
});

for await (const chunk of stream) {
  if (chunk.type === 'text') {
    console.log(chunk.text);
  }
}
```

### Advanced Settings

```typescript
const response = await provider
  .languageModel('claude-3-opus-20240229', {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    system: 'You are a helpful assistant.',
    stopSequences: ['\n\n'],
  })
  .generate({
    prompt: 'Hello, world!',
  });
```

## API Reference

### AnthropicAiProvider

The main provider class for interacting with Anthropic's Claude API.

#### Constructor

```typescript
new AnthropicAiProvider({
  apiKey: string;
  middleware?: LanguageModelV1Middleware;
  baseURL?: string;
  headers?: Record<string, string>;
})
```

#### Methods

##### languageModel

```typescript
languageModel(
  modelId: AnthropicModelId,
  settings?: AnthropicSettings
): LanguageModelV1
```

Returns a language model instance that can be used to generate text or stream responses.

### Types

#### AnthropicModelId

```typescript
type AnthropicModelId =
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307'
  | 'claude-2.1'
  | 'claude-2.0'
  | 'claude-instant-1.2'
  | (string & {});
```

#### AnthropicSettings

```typescript
interface AnthropicSettings {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stream?: boolean;
  system?: string;
  stopSequences?: string[];
}
```

## Environment Variables

You can set the `ANTHROPIC_API_KEY` environment variable instead of passing the API key directly to the constructor.

## License

MIT
