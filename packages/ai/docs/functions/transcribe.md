## Function: `transcribe`

Generates a transcript from an audio file.

**Purpose:**
This function provides a way to convert audio input into transcribed text. It leverages transcription models to perform the conversion.

**Parameters:**

- `model`: **TranscriptionModel** (required)
  - The transcription model to use.
- `audio`: **string | Uint8Array | ArrayBuffer | Buffer | URL** (required)
  - The audio file to generate the transcript from.
- `prompt`: **string** (optional)
  - An optional text prompt to guide the transcription and spelling.
- `temperature`: **number** (optional)
  - The sampling temperature, between 0 and 1.
- `language`: **string** (optional)
  - The language of the audio data as an ISO 639-1 code (e.g., 'en').
- `maxRetries`: **number** (optional)
  - Maximum number of retries. Defaults to 2.
- `abortSignal`: **AbortSignal** (optional)
  - An optional abort signal to cancel the call.
- `headers`: **Record<string, string>** (optional)
  - Additional HTTP headers for the request.

**Return Value:**

An object with the following properties:

- `text`: **string**
  - The complete transcribed text from the audio input.
- `segments`: **Array<{ text: string; start: number; end: number; }>**
  - An array of transcript segments.
- `rawResponse`: **{ headers?: Record<string, string> }** (optional)
  - The raw response from the provider.
- `warnings`: **Array<string>** (optional)
  - An array of warnings from the model provider.

**Examples:**

```typescript
import { transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const { text, segments, warnings, rawResponse } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

console.log(text);
console.log(segments);
console.log(warnings);
console.log(rawResponse);
```
