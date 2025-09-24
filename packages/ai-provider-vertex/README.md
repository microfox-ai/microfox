> **Note:** This package is deprecated and will no longer be maintained. Please consider using an alternative.

# Google Vertex Provider for Vercel's AI SDK

This package provides a convenient wrapper for using Google Vertex's various models through Vercel's AI SDK.

## Installation

```bash
npm install @microfox/ai-provider-vertex
```

## Usage

### Language Models

```typescript
import { VertexProvider } from '@microfox/ai-provider-vertex';
import { generateText } from 'ai';

const vertex = new VertexProvider();

const response = await generateText({
  model: vertex.languageModel('gemini-1.5-pro-latest'),
  prompt: 'Hello, world!',
});

console.log(response.text);
``` 