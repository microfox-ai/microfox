# postApiGenerateLyrics

Generate lyrics based on a prompt.

## Usage

```typescript
import { createClient, postApiGenerateLyrics } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function generateLyrics() {
  try {
    const response = await postApiGenerateLyrics({
      client: client,
      body: {
        prompt: "A song about a robot falling in love"
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

generateLyrics();
```

## Parameters

The `postApiGenerateLyrics` function accepts an `options` object with the following properties:

| Name     | Type                                     | Description                                |
| -------- | ---------------------------------------- | ------------------------------------------ |
| `client` | `Client`                                 | An instance of the Suno API client.        |
| `body`   | `{ prompt: string }`                     | The request body.                          |

### Body Properties

| Name     | Type   | Description                   |
| -------- | ------ | ----------------------------- |
| `prompt` | string | The prompt for generating the lyrics. |

## Returns

A promise that resolves to an object with the following properties:

| Name     | Type   | Description        |
| -------- | ------ | ------------------ |
| `text`   | string | The generated lyrics. |
| `title`  | string | The title of the music. |
| `status` | string | The status of the generation. |

</rewritten_file> 