## Function: `generateSpeech`

Asynchronously generates speech from text using the specified voice and language. This function validates the input parameters and sends a request to the Suno API's `/tts/generate` endpoint.

**Purpose:**
This function is used to convert written text into natural-sounding spoken audio. It is useful for applications such as voiceovers, accessibility features, and interactive voice response (IVR) systems.

**Parameters:**

- `params` (required, `TextToSpeechParams` object): An object containing the parameters for the text-to-speech conversion.
  - `text` (required, `string`): The text that you want to convert into speech.
  - `voice` (required, `string`): The voice to use for the speech synthesis. This can be a generic identifier like "male" or "female", or a specific voice name provided by the Suno API.
  - `language` (required, `string`): The language of the text, specified as a language code (e.g., "en-US" for American English, "es-ES" for Spanish).

**Return Value:**

- (`Promise<TextToSpeechResponse>`): A promise that resolves to a `TextToSpeechResponse` object containing the details of the generated audio.
  - `audioUrl` (`string`): A URL from which the generated audio file can be downloaded.
  - `status` (`string`): The status of the text-to-speech conversion (e.g., "success", "failed").
  - `message` (optional, `string`): An optional message providing additional information about the status of the request.

**Examples:**

```typescript
import { createSunoSDK } from '@microfox/suno';

const sunoSDK = createSunoSDK({ apiKey: 'your-suno-api-key' });

// Example 1: Basic text-to-speech conversion
async function generateBasicSpeech() {
  try {
    const result = await sunoSDK.generateSpeech({
      text: 'Hello, world! This is a test of the Suno text-to-speech API.',
      voice: 'female',
      language: 'en-US'
    });
    console.log('Speech generation successful:', result);
    // Expected output: { audioUrl: 'https://...', status: 'success' }
  } catch (error) {
    console.error('Error generating speech:', error);
  }
}

generateBasicSpeech();
```

```typescript
// Example 2: Generating speech in a different language
async function generateSpanishSpeech() {
  try {
    const result = await sunoSDK.generateSpeech({
      text: 'Hola, mundo. Esta es una prueba de la API de texto a voz de Suno.',
      voice: 'male',
      language: 'es-ES'
    });
    console.log('Spanish speech generation successful:', result);
  } catch (error) {
    console.error('Error generating Spanish speech:', error);
  }
}

generateSpanishSpeech();
```

```typescript
// Example 3: Handling API errors
async function generateSpeechWithError() {
  // Assuming the API returns an error for an invalid language code
  try {
    await sunoSDK.generateSpeech({
      text: 'This will fail.',
      voice: 'female',
      language: 'xx-XX' // Invalid language code
    });
  } catch (error) {
    console.error(error.message); // e.g., "HTTP error! status: 400 - Invalid language"
  }
}

generateSpeechWithError();
```
