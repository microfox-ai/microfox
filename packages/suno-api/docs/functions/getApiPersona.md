# getApiPersona

Retrieve information about a persona, including their clips and pagination data.

## Usage

```typescript
import { createClient, getApiPersona } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function getPersona() {
  try {
    const response = await getApiPersona({
      client: client,
      query: {
        id: "your-persona-id",
        page: 1
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getPersona();
```

## Parameters

The `getApiPersona` function accepts an `options` object with the following properties:

| Name     | Type                                     | Description                                |
| -------- | ---------------------------------------- | ------------------------------------------ |
| `client` | `Client`                                 | An instance of the Suno API client.        |
| `query`  | `{ id: string, page?: number }`          | The query parameters.                      |

### Query Properties

| Name   | Type   | Description                      |
| ------ | ------ | -------------------------------- |
| `id`   | string | The ID of the persona to retrieve. |
| `page` | number | (Optional) The page number for pagination (defaults to 1). |

## Returns

A promise that resolves to an object containing persona information. See `GetApiPersonaResponses['200']` in `types.gen.ts` for the full response shape. 