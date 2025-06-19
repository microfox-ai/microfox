# Perplexity Provider for Vercel's AI SDK

This package provides a convenient wrapper for using Perplexity's various models through Vercel's AI SDK.

## Installation

```bash
npm install @microfox/ai-provider-perplexity
```

## Usage

### Language Models

```typescript
import { PerplexityProvider } from '@microfox/ai-provider-perplexity';
import { generateText } from 'ai';

const perplexity = new PerplexityProvider({
  apiKey: process.env.PERPLEXITY_API_KEY!,
});

const response = await generateText({
  model: perplexity.languageModel('sonar-pro'),
  prompt: 'Hello, world!',
});

console.log(response.text);
```

### Accessing Sources

A key feature of the Perplexity provider is its ability to provide sources for the information it generates. You can access these from the `sources` property in the result.

```typescript
import { PerplexityProvider } from '@microfox/ai-provider-perplexity';
import { generateText } from 'ai';

const perplexity = new PerplexityProvider({
  apiKey: process.env.PERPLEXITY_API_KEY!,
});

const { text, sources } = await generateText({
  model: perplexity.languageModel('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
});

console.log(text);
console.log(sources);
```

### Provider Options & Metadata

You can pass provider-specific options using `providerOptions`. For example, you can enable image responses (for Tier-2 Perplexity users). The response will also contain `providerMetadata` with usage metrics.

```typescript
const result = await generateText({
  model: perplexity.languageModel('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
  providerOptions: {
    perplexity: {
      return_images: true, // Enable image responses (Tier-2 Perplexity users only)
    },
  },
});

console.log(result.text);
console.log(result.providerMetadata);
// Example output:
// {
//   perplexity: {
//     usage: { citationTokens: 5286, numSearchQueries: 1 },
//     images: [
//       { imageUrl: "https://example.com/image1.jpg", originUrl: "https://elsewhere.com/page1", height: 1280, width: 720 },
//       { imageUrl: "https://example.com/image2.jpg", originUrl: "https://elsewhere.com/page2", height: 1280, width: 720 }
//     ]
//   },
// }
```

## Configuration Options

### PerplexityProvider Options

### Model Options

#### Language Models

- Available models: 'sonar-deep-research', 'sonar-reasoning-pro', 'sonar-reasoning', 'sonar-pro', 'sonar'

### Model Capabilities

| Model                   | Image Input | Object Generation | Tool Usage | Tool Streaming |
| ----------------------- | ----------- | ----------------- | ---------- | -------------- |
| sonar-pro               |             |                   |            |                |
| sonar                   |             |                   |            |                |
| sonar-deep-research     |             |                   |            |                |
| sonar-reasoning         |             |                   |            |                |
| sonar-reasoning-pro     |             |                   |            |                |

*Please note that the empty cells indicate that the feature is not supported by the model according to the AI SDK documentation.*

## Best Practices

1. Always store your API key in environment variables