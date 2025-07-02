![hero illustration](./assets/hero.gif)

# AI SDK

The [AI SDK](https://ai-sdk.dev/docs) is a TypeScript toolkit designed to help you build AI-powered applications using popular frameworks like Next.js, React, Svelte, Vue and runtimes like Node.js.

To learn more about how to use the AI SDK, check out our [API Reference](https://ai-sdk.dev/docs/reference) and [Documentation](https://ai-sdk.dev/docs).

## Usage

### AI SDK Core

The [AI SDK Core](https://ai-sdk.dev/docs/ai-sdk-core/overview) module provides a unified API to interact with model providers like [OpenAI](https://ai-sdk.dev/providers/ai-sdk-providers/openai), [Anthropic](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic), [Google](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai), and more.

###### @/index.ts (Node.js Runtime)

```ts
import { generateText } from '@microfox/ai';
import { OpenAiProvider } from '@microfox/ai-provider-openai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const { text } = await generateText({
  model: openai.languageModel('gpt-4o'),
  system: 'You are a friendly assistant!',
  prompt: 'Why is the sky blue?',
});

console.log(text);
```
