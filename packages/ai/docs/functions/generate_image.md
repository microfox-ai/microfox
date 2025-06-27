## Function: `generateImage`

Generates images from a text prompt using an image model.

### Purpose

To programmatically create images from textual descriptions. This is useful for content creation, data augmentation, or any application that requires dynamic image generation.

### Parameters

- `options`: object
  - `model`: `ImageModel` - The image model to use. (Required)
  - `prompt`: `string` - A descriptive text prompt for the image. (Required)
  - `n`: `number` - Optional. The number of images to generate.
  - `size`: `` `${number}x${number}` `` - Optional. The size of the images (e.g., `'1024x1024'`).
  - `aspectRatio`: `` `${number}:${number}` `` - Optional. The aspect ratio (e.g., `'16:9'`).
  - `seed`: `number` - Optional. A seed for reproducible image generation.
  - `providerOptions`: `ProviderOptions` - Optional, provider-specific options.
  - `maxRetries`: `number` - Optional. Maximum number of retries. Defaults to `2`.
  - `abortSignal`: `AbortSignal` - Optional. A signal to cancel the call.
  - `headers`: `Record<string, string>` - Optional. Additional HTTP headers.

### Return Value

A `Promise` that resolves to a `GenerateImageResult` object:

- `image`: `GeneratedFile` - The first generated image.
- `images`: `GeneratedFile[]` - An array of all generated images.
- `warnings`: `ImageGenerationWarning[] | undefined` - Any warnings from the model provider.
- `responses`: `ImageModelResponseMetadata[]` - Metadata from the provider for each response.

Each `GeneratedFile` object contains:

- `base64`: `string` - The base64-encoded image.
- `uint8Array`: `Uint8Array` - The image as a `Uint8Array`.
- `mediaType`: `string` - The IANA media type of the image (e.g., `'image/png'`).

### Examples

```typescript
import { generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

// Example 1: Basic image generation
const { images } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A futuristic cityscape at sunset',
});
console.log(images[0].base64); // Log the base64 string of the first image

// Example 2: Generating multiple images of a specific size
const { images: multipleImages } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A cute kitten playing with a ball of yarn',
  n: 2,
  size: '512x512',
});

// Example 3: Using a seed for reproducibility
const { image: seededImage } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A majestic dragon soaring through the clouds',
  seed: 12345,
});
```
