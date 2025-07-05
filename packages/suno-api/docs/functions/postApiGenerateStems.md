# postApiGenerateStems

Generate separate instrumental and vocal tracks (stems) for a song.

## Usage

```typescript
import { createClient, postApiGenerateStems } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function generateStems() {
  try {
    const response = await postApiGenerateStems({
      client: client,
      body: {
        audio_id: "your-audio-id"
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

generateStems();
```

## Parameters

The `postApiGenerateStems` function accepts an `options` object with the following properties:

| Name     | Type                                     | Description                                |
| -------- | ---------------------------------------- | ------------------------------------------ |
| `client` | `Client`                                 | An instance of the Suno API client.        |
| `body`   | `{ audio_id: string }`                   | The request body.                          |

### Body Properties

| Name       | Type   | Description                             |
| ---------- | ------ | --------------------------------------- |
| `audio_id` | string | The ID of the song to generate stems for. |

## Returns

A promise that resolves to an object containing the URLs for the generated stems. The exact shape of the response is not documented in the OpenAPI spec, but it is expected to contain audio information for the stems. 