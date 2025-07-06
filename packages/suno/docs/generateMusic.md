## Function: `generateMusic`

Asynchronously generates a piece of music based on the provided parameters. This function validates the input and sends a request to the Suno API's `/music/generate` endpoint.

**Purpose:**
This function is used to create original music compositions. You can specify the genre, duration, and tempo to tailor the generated music to your specific needs. It's ideal for applications requiring background music, soundtracks, or creative musical content.

**Parameters:**

- `params` (required, `MusicGenerationParams` object): An object containing the parameters for music generation.
  - `genre` (required, `string`): The genre of the music to be generated (e.g., "rock", "jazz", "classical").
  - `duration` (required, `number`): The desired duration of the music in seconds. This must be a positive number.
  - `tempo` (required, `number`): The tempo of the music in beats per minute (BPM). This must be a positive number.
  - `otherParameters` (optional, `Record<string, unknown>`): An object containing any additional, non-standard parameters to be sent to the music generation API.

**Return Value:**

- (`Promise<MusicGenerationResponse>`): A promise that resolves to a `MusicGenerationResponse` object containing the details of the generated music.
  - `audioUrl` (`string`): A URL from which the generated music file can be downloaded.
  - `status` (`string`): The status of the music generation request (e.g., "success", "failed").
  - `message` (optional, `string`): An optional message providing additional information about the status of the request.

**Examples:**

```typescript
import { createSunoSDK } from '@microfox/suno';

const sunoSDK = createSunoSDK({ apiKey: 'your-suno-api-key' });

// Example 1: Minimal usage with only required arguments
async function generateSimpleSong() {
  try {
    const result = await sunoSDK.generateMusic({
      genre: 'acoustic',
      duration: 60, // 60 seconds
      tempo: 120    // 120 BPM
    });
    console.log('Music generation successful:', result);
    // Expected output: { audioUrl: 'https://...', status: 'success' }
  } catch (error) {
    console.error('Error generating music:', error);
  }
}

generateSimpleSong();
```

```typescript
// Example 2: Full usage with all optional arguments
async function generateCustomSong() {
  try {
    const result = await sunoSDK.generateMusic({
      genre: 'cinematic',
      duration: 180, // 3 minutes
      tempo: 90,
      otherParameters: {
        mood: 'epic',
        instrumentation: ['strings', 'brass']
      }
    });
    console.log('Custom music generation successful:', result);
  } catch (error) {
    console.error('Error generating custom music:', error);
  }
}

generateCustomSong();
```

```typescript
// Example 3: Handling API errors
async function generateWithError() {
  // Assuming the API returns an error for an unsupported genre
  try {
    await sunoSDK.generateMusic({
      genre: 'unsupported-genre',
      duration: 30,
      tempo: 100
    });
  } catch (error) {
    console.error(error.message); // e.g., "HTTP error! status: 400 - Invalid genre"
  }
}

generateWithError();
```
