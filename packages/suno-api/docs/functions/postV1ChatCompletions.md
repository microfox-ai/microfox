# postV1ChatCompletions

Generate audio based on a prompt, with a response format compatible with the OpenAI API.

## Usage

```typescript
import { createClient, postV1ChatCompletions } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function generate() {
  try {
    const response = await postV1ChatCompletions({
      client: client,
      body: {
        prompt: "A funky disco beat"
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

generate();
```

## Parameters

The `postV1ChatCompletions` function accepts an `options` object with the following properties:

| Name     | Type                                     | Description                                                                                                                              |
| -------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `client` | `Client`                                 | An instance of the Suno API client.                                                                                                     |
| `body`   | `{ prompt: string }`                     | The request body.                                                                                                                        |

### Body Properties

| Name     | Type   | Description      |
| -------- | ------ | ---------------- |
| `prompt` | string | The prompt for generating the audio. |

## Returns

A promise that resolves to an object with the following properties:

| Name   | Type     | Description                                                          |
| ------ | -------- | -------------------------------------------------------------------- |
| `data` | `string` | A text description for the music, with details like title, album cover, lyrics, and more. |

</rewritten_file> 