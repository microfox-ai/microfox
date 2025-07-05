# postApiConcat

Concatenate audio clips to generate a complete song.

## Usage

```typescript
import { createClient, postApiConcat } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function concatClips() {
  try {
    const response = await postApiConcat({
      client: client,
      body: {
        clip_id: "your-starting-clip-id"
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

concatClips();
```

## Parameters

The `postApiConcat` function accepts an `options` object with the following properties:

| Name     | Type                                     | Description                                |
| -------- | ---------------------------------------- | ------------------------------------------ |
| `client` | `Client`                                 | An instance of the Suno API client.        |
| `body`   | `{ clip_id: string }`                    | The request body.                          |

### Body Properties

| Name      | Type   | Description                                           |
| --------- | ------ | ----------------------------------------------------- |
| `clip_id` | string | The ID of the clip to use as the base for concatenation. |

## Returns

A promise that resolves to an `AudioInfo` object for the complete song. 