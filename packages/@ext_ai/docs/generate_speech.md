## Function: `generateSpeech`

Generates speech audio from text. This is an experimental feature.

**Purpose:**
This function converts text into speech audio using a specified speech model.

**Parameters:**

- `model`: SpeechModelV1 (required)
  - The speech model to use. This parameter is required and must be a valid `SpeechModelV1` object.
- `text`: string (required)
  - The text to convert to speech. This parameter is required.
- `voice`: string (optional)
  - The voice to use for the generated speech.
- `outputFormat`: string (optional)
  - The desired output format for the audio file (e.g., "mp3", "wav").
- `instructions`: string (optional)
  - Additional instructions for the speech generation process.
- `speed`: number (optional)
  - The speed of the generated speech.
- `providerOptions`: Record<string, Record<string, JSONValue>> (optional)
  - Additional provider-specific options. This is an object where keys are provider names and values are objects containing provider-specific options. The inner objects have string keys and `JSONValue` values. `JSONValue` can be a string, number, boolean, null, array, or object.
- `maxRetries`: number (optional)
  - The maximum number of retries if the speech generation fails. Default: 2.
- `abortSignal`: AbortSignal (optional)
  - An optional abort signal to cancel the function call.
- `headers`: Record<string, string> (optional)
  - Additional HTTP headers to include in the request. This is an object where keys and values are strings.

**Return Value:**

- `audio`: GeneratedAudioFile

  - The generated audio file.

  - `GeneratedAudioFile` Structure:

    - `base64`: string
      - The audio data encoded as a base64 string.
    - `uint8Array`: Uint8Array
      - The audio data as a Uint8Array.
    - `mimeType`: string
      - The MIME type of the audio (e.g., "audio/mpeg").
    - `format`: string
      - The format of the audio (e.g., "mp3").
    - `warnings`: array<SpeechWarning>
      - An array of warnings from the model provider (e.g., unsupported settings).
    - `responses`: array<SpeechModelResponseMetadata>

      - Response metadata from the provider. There may be multiple responses if multiple calls were made to the model.

      - `SpeechModelResponseMetadata` Structure:
        - `timestamp`: Date
          - The timestamp for the start of the generated response.
        - `modelId`: string
          - The ID of the model used to generate the response.
        - `headers`: Record<string, string> (optional)
          - Response headers. This is an object where keys and values are strings.

**Examples:**

```typescript
// Example 1: Minimal usage
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { OpenAiProvider } from '@microfox/ai-provider-openai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const { audio } = await generateSpeech({
  model: openai.speechModel('tts-1'),
  text: 'Hello from the AI SDK!',
});

console.log(audio);

// Example 2: With optional parameters
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { OpenAiProvider } from '@microfox/ai-provider-openai';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const { audio } = await generateSpeech({
  model: openai.speechModel('tts-1'),
  text: 'This is a test.',
  voice: 'alloy',
  outputFormat: 'mp3',
  instructions: 'Speak slowly and clearly.',
  speed: 0.5,
  providerOptions: {
    openai: {
      temperature: 0.7,
    },
  },
  maxRetries: 3,
});

console.log(audio);

// Example 3: With abort signal
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { OpenAiProvider } from '@microfox/ai-provider-openai';
import { AbortController } from 'node:abort_controller';

const openai = new OpenAiProvider({
  apiKey: process.env.OPENAI_API_KEY!,
});

const controller = new AbortController();
const signal = controller.signal;

setTimeout(() => {
  controller.abort();
}, 1000); // Abort after 1 second

try {
  const { audio } = await generateSpeech({
    model: openai.speechModel('tts-1'),
    text: 'This might be interrupted.',
    abortSignal: signal,
  });
  console.log(audio);
} catch (error) {
  console.error('Request aborted:', error);
}
```
