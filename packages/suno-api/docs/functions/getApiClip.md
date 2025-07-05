# getApiClip

Retrieve information for a specific audio clip by its ID.

## Usage

```typescript
import { createClient, getApiClip } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function getClip() {
  try {
    const response = await getApiClip({
      client: client,
      query: {
        id: "your-clip-id"
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getClip();
```

## Parameters

The `getApiClip` function accepts an `options` object with the following properties:

| Name     | Type                                     | Description                                |
| -------- | ---------------------------------------- | ------------------------------------------ |
| `client` | `Client`                                 | An instance of the Suno API client.        |
| `query`  | `{ id: string }`                         | The query parameters.                      |

### Query Properties

| Name | Type   | Description      |
| ---- | ------ | ---------------- |
| `id` | string | The ID of the clip to retrieve. |

## Returns

A promise that resolves to an `AudioInfo` object for the specified clip. 