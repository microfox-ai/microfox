# Suno API SDK

A lightweight, type-safe SDK for interacting with the Suno API.

## Installation

```bash
npm install @microfox/suno-api
```

## Authentication

The Suno API uses an API key for authentication. You need to pass the `suno-api-key` header with your API key in all requests. You can do this by creating a client instance with the required header.

## Usage

```typescript
import { createClient, postApiGenerate } from '@microfox/suno-api';

// Create a new client instance with the API key
const client = createClient({
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY' // Replace with your actual API key
  }
});

// Generate audio
async function generate() {
  try {
    const response = await postApiGenerate({
      client: client,
      body: {
        prompt: "A soaring orchestral piece for a movie trailer",
        make_instrumental: false,
        wait_audio: false
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

generate();
```

## Functions

* **`postApiGenerate`**: Generate audio based on a prompt.
* **`postV1ChatCompletions`**: Generate audio based on a prompt (OpenAI API format compatibility).
* **`postApiCustomGenerate`**: Generate audio with custom parameters like genre and lyrics.
* **`postApiExtendAudio`**: Extend the length of an existing audio clip.
* **`postApiGenerateStems`**: Generate separate audio and music tracks (stems) for a song.
* **`postApiGenerateLyrics`**: Generate lyrics based on a prompt.
* **`getApiGet`**: Get information about one or more audio clips.
* **`getApiGetLimit`**: Get information about your API usage and limits.
* **`getApiGetAlignedLyrics`**: Get lyric alignment for a song.
* **`getApiClip`**: Get information about a specific clip.
* **`postApiConcat`**: Concatenate audio clips to generate a complete song.
* **`getApiPersona`**: Get information about a persona, including their clips.

## Error Handling

The SDK uses Zod for runtime type validation and will throw errors if:

- The message payload doesn't match the expected schema
- The API response doesn't match the expected schema
- The API request fails 