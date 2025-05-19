## Function: `customProvider`

Creates a custom provider that allows mapping IDs to any model, enabling custom model configurations, aliases, and fallback mechanisms.

**Purpose:**

This function allows developers to create a custom provider for managing language models, text embedding models, and image models. It provides flexibility in configuring models with custom settings, creating aliases for existing models, and defining a fallback provider for handling requests for unavailable models.

**Parameters:**

- `languageModels` (optional): `Record<string, LanguageModel>`
  - A record mapping model IDs (strings) to `LanguageModel` instances. This allows configuring custom settings for specific language models or creating aliases.
- `textEmbeddingModels` (optional): `Record<string, EmbeddingModelV1<string>>`
  - A record mapping model IDs (strings) to `EmbeddingModelV1<string>` instances. This allows configuring custom settings for specific text embedding models or creating aliases.
- `imageModels` (optional): `Record<string, ImageModelV1>`
  - A record mapping model IDs (strings) to `ImageModelV1` instances. This allows configuring custom settings for specific image models or creating aliases.
- `fallbackProvider` (optional): `Provider`
  - An optional fallback provider to use when a requested model is not found in the custom provider. This allows seamless integration with existing providers and ensures graceful handling of missing models.

**Return Value:**

- `Provider`
  - An object representing the custom provider. It has the following methods:
    - `languageModel(id: string): LanguageModel`
      - Returns a `LanguageModel` instance for the given `id` (format: `providerId:modelId`).
    - `textEmbeddingModel(id: string): EmbeddingModelV1<string>`
      - Returns an `EmbeddingModelV1<string>` instance for the given `id` (format: `providerId:modelId`).
    - `imageModel(id: string): ImageModelV1`
      - Returns an `ImageModelV1` instance for the given `id` (format: `providerId:modelId`).

**Examples:**

```typescript
// Example 1: Custom model settings
import { OpenAiProvider } from '@microfox/openai-provider';
import { customProvider } from 'ai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const myOpenAI = customProvider({
  languageModels: {
    'gpt-4': openai.languageModel('gpt-4', { structuredOutputs: true }),
    'gpt-4o-structured': openai.languageModel('gpt-4o', {
      structuredOutputs: true,
    }),
  },
  fallbackProvider: openai,
});

const model = myOpenAI.languageModel('gpt-4'); // Returns a gpt-4 model with structuredOutputs enabled
const aliasModel = myOpenAI.languageModel('gpt-4o-structured'); // Returns a gpt-4o model with structuredOutputs enabled and aliased as 'gpt-4o-structured'
const fallbackModel = myOpenAI.languageModel('gpt-3.5-turbo'); // Returns the gpt-3.5-turbo model from the fallback provider (openai)

// Example 2: Custom text embedding model
const myEmbeddingProvider = customProvider({
  textEmbeddingModels: {
    'my-embedding-model': openai.embedding('text-embedding-ada-002'), // Example using OpenAI's embedding model
  },
});

const embeddingModel =
  myEmbeddingProvider.textEmbeddingModel('my-embedding-model');

// Example 3: Custom image model
const myImageProvider = customProvider({
  imageModels: {
    'dall-e-3': openai.image('dall-e-3'), // Example using OpenAI's image model
  },
});

const imageModel = myImageProvider.imageModel('dall-e-3');

// Example 4: Only fallback provider
const fallbackOnlyProvider = customProvider({
  fallbackProvider: openai,
});

const fallbackModel2 = fallbackOnlyProvider.languageModel('gpt-3.5-turbo'); // Returns the gpt-3.5-turbo model from the fallback provider

// Example 5: Empty custom provider
const emptyProvider = customProvider({}); // No custom models defined

try {
  emptyProvider.languageModel('any-model'); // Throws an error because no model is found and no fallback is provided
} catch (error) {
  console.error('Model not found:', error);
}
```
