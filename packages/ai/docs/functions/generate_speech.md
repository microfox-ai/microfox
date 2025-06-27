## Function: `generateSpeech`

Generates speech audio from text using a speech model.

### Purpose

To convert text into spoken audio programmatically. This is useful for creating voice responses, audio content, and accessibility features.

### Parameters

- `options`: object
  - `model`: `SpeechModel` - The speech model to use. (Required)
  - `text`: `string` - The text to convert to speech. (Required)
  - `voice`: `string` - Optional. The voice to use.
  - `outputFormat`: `string` - Optional. The output audio format (e.g., `'mp3'`, `'wav'`).
  - `instructions`: `string` - Optional. Additional instructions for the speech generation.
  - `speed`: `number` - Optional. The speed of the speech.
  - `providerOptions`: `ProviderOptions` - Optional, provider-specific options.
  - `maxRetries`: `number` - Optional. Maximum number of retries. Defaults to `2`.
  - `abortSignal`: `AbortSignal` - Optional. A signal to cancel the call.
  - `headers`: `Record<string, string>` - Optional. Additional HTTP headers.

### Return Value

A `Promise` that resolves to a `SpeechResult` object:

- `audio`: `GeneratedFile` - The generated audio file.
  - `base64`: `string` - The base64-encoded audio.
  - `uint8Array`: `Uint8Array` - The audio as a `Uint8Array`.
  - `mediaType`: `string` - The IANA media type of the audio (e.g., `'audio/mpeg'`).
- `format`: `string` - The format of the audio file.
- `warnings`: `SpeechWarning[] | undefined` - Any warnings from the model provider.
- `response`: `SpeechModelResponseMetadata` - Metadata from the provider.
- `providerMetadata`: `ProviderMetadata | undefined` - Provider-specific metadata.

### Examples

```typescript
import { generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

// Example 1: Basic speech generation
const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
});
// You can now save or play the audio file.
// For example, in Node.js:
// import { promises as fs } from 'fs';
// await fs.writeFile('speech.mp3', audio.uint8Array);

// Example 2: Using a different voice and format
const { audio: audio2 } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'This is a test with a different voice.',
  voice: 'alloy',
  outputFormat: 'mp3',
  speed: 0.9,
});

// Example 3: Using an abort signal
const controller = new AbortController();

const speechPromise = generateSpeech({
  model: openai.speech('tts-1'),
  text: 'This speech generation will be aborted.',
  abortSignal: controller.signal,
});

controller.abort();

try {
  await speechPromise;
} catch (e) {
  console.log(e); // AbortError
}
```
