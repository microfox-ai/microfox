## Function: `createProviderRegistry`

Creates a registry for managing multiple AI providers and their models. This allows accessing models using simple string IDs in the format `providerId:modelId`.

**Purpose:**

Centralized management of multiple AI providers and their associated models, simplifying model access using string identifiers.

**Parameters:**

- `providers`: object<string, Provider> - Required. A record mapping provider IDs (strings) to `Provider` objects. The provider ID should be unique within the registry.

  - `Provider` object:
    - `languageModel`: function<(id: string) => LanguageModel> - A function that returns a `LanguageModel` instance given its ID.
    - `textEmbeddingModel`: function<(id: string) => EmbeddingModel<string>> - A function that returns a `TextEmbeddingModel` instance given its ID.
    - `imageModel`: function<(id: string) => ImageModel> - A function that returns an `ImageModel` instance given its ID.

- `options`: object - Optional. Configuration options for the registry.
  - `separator`: string - Optional. Custom separator between provider and model IDs. Defaults to ":".

**Return Value:**

A `ProviderRegistry` object with the following methods:

- `languageModel`: function<(id: string) => LanguageModel> - Returns a language model instance based on its combined ID (e.g., "providerId:modelId").
- `textEmbeddingModel`: function<(id: string) => EmbeddingModel<string>> - Returns a text embedding model instance based on its combined ID.
- `imageModel`: function<(id: string) => ImageModel> - Returns an image model instance based on its combined ID.

**Examples:**

```typescript
// Example 1: Basic usage with default separator
import { AnthropicProvider } from '@microfox/anthropic-provider';
import { OpenAiProvider } from '@microfox/openai-provider';
import { createProviderRegistry } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const anthropic = new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const registry = createProviderRegistry({
  anthropic,
  openai,
});

const languageModel = registry.languageModel('openai:gpt-4-turbo');
const embeddingModel = registry.textEmbeddingModel(
  'openai:text-embedding-3-small',
);
const imageModel = registry.imageModel('anthropic:claude-2');

// Example 2: Accessing models
import { generateText, embed, generateImage } from 'ai';

async function generateContent() {
  const textResult = await generateText({
    model: registry.languageModel('openai:gpt-4-turbo'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });
  console.log(textResult.text);

  const embeddingResult = await embed({
    model: registry.textEmbeddingModel('openai:text-embedding-3-small'),
    value: 'sunny day at the beach',
  });
  console.log(embeddingResult.embedding);

  const imageResult = await generateImage({
    model: registry.imageModel('anthropic:claude-2'),
    prompt: 'A beautiful sunset over a calm ocean',
  });
  console.log(imageResult.image);
}

generateContent();
```
