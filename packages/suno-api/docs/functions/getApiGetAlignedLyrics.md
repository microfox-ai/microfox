# getApiGetAlignedLyrics

Get lyric alignment for a song.

## Usage

```typescript
import { createClient, getApiGetAlignedLyrics } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function getAlignedLyrics() {
  try {
    const response = await getApiGetAlignedLyrics({
      client: client,
      query: {
        song_id: "your-song-id"
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getAlignedLyrics();
```

## Parameters

The `getApiGetAlignedLyrics` function accepts an `options` object with the following properties:

| Name     | Type                                     | Description                                |
| -------- | ---------------------------------------- | ------------------------------------------ |
| `client` | `Client`                                 | An instance of the Suno API client.        |
| `query`  | `{ song_id: string }`                    | The query parameters.                      |

### Query Properties

| Name      | Type   | Description |
| --------- | ------ | ----------- |
| `song_id` | string | The ID of the song. |

## Returns

A promise that resolves to an object containing the lyric alignment information. The exact shape of the response is not documented in the OpenAPI spec. 