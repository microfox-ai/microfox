> **Note:** This package is deprecated and will no longer be maintained. Please consider using an alternative.

# OpenAI Provider for Vercel's AI SDK

This package provides a convenient wrapper for using OpenAI's various models through Vercel's AI SDK.

## Installation

```bash
npm install @microfox/ai-provider-openai
```

## Usage

### Language Models

```typescript
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { generateText } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const response = await generateText({
  model: openai.languageModel('gpt-4o'),
  prompt: 'Hello, world!',
});

console.log(response);
```

### Image Generation

```typescript
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { generateImage } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const image = await generateImage({
  model: openai.imageModel('dall-e-3'),
  prompt: 'A serene landscape with mountains and a lake',
  size: '1024x1024',
  quality: 'standard',
  style: 'natural',
});

console.log(image.url);
```

### Speech Generation

```typescript
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { generateSpeech } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const speech = await generateSpeech({
  model: openai.speechModel('tts-1'),
  input: 'Hello, this is a test of the speech generation.',
  voice: 'alloy',
  responseFormat: 'mp3',
});

// Save the audio file or stream it
console.log(speech.audio);
```

### Audio Transcription

```typescript
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { transcribeAudio } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const transcription = await transcribeAudio({
  model: openai.transcriptionModel('whisper-1'),
  audio: audioFileBuffer, // Your audio file buffer
  language: 'en',
  responseFormat: 'text',
});

console.log(transcription.text);
```

## Configuration Options

### OpenAiProvider Options

```typescript
interface OpenAiProviderConfig {
  apiKey: string;
  organization?: string;
  baseURL?: string;
}
```

### Model Options

#### Language Models

- Available models: 'gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'
- Additional options: temperature, maxTokens, etc.

#### Image Models

- Available models: 'dall-e-2', 'dall-e-3'
- Size options: '256x256', '512x512', '1024x1024'
- Quality options: 'standard', 'hd'
- Style options: 'natural', 'vivid'

#### Speech Models

- Available models: 'tts-1'
- Voice options: 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
- Response format options: 'mp3', 'opus', 'aac', 'flac'

#### Transcription Models

- Available models: 'whisper-1'
- Language options: 'en', 'fr', 'de', etc.
- Response format options: 'text', 'srt', 'vtt', 'json'

## Error Handling

The provider includes built-in error handling for common API issues:

```typescript
try {
  const response = await generateText({
    model: openai.languageModel('gpt-4'),
    prompt: 'Hello, world!',
  });
} catch (error) {
  if (error instanceof OpenAiError) {
    console.error('OpenAI API Error:', error.message);
  }
}
```

## Best Practices

1. Always store your API key in environment variables
2. Implement proper error handling
3. Use appropriate model versions for your use case
4. Consider rate limits and costs when choosing models
5. Implement proper caching strategies for production use

## License

MIT
