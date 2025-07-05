# Suno API SDK

A lightweight, type-safe SDK for interacting with the Suno API.

## Installation

```bash
npm install @microfox/suno-api
```

## Usage

```typescript
import { createClient, postApiGenerate } from '@microfox/suno-api';

// Create a new client instance
const client = createClient();

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

## Error Handling

The SDK uses Zod for runtime type validation and will throw errors if:

- The message payload doesn't match the expected schema
- The API response doesn't match the expected schema
- The API request fails 