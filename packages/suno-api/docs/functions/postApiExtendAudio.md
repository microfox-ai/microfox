# postApiExtendAudio

Extend the length of an existing audio clip.

## Usage

```typescript
import { createClient, postApiExtendAudio } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function extendAudio() {
  try {
    const response = await postApiExtendAudio({
      client: client,
      body: {
        audio_id: "your-audio-id",
        prompt: "Continue the epic orchestral score"
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

extendAudio();
```

## Parameters

The `postApiExtendAudio` function accepts an `options` object with the following properties:

| Name     | Type                                     | Description                                |
| -------- | ---------------------------------------- | ------------------------------------------ |
| `client` | `Client`                                 | An instance of the Suno API client.        |
| `body`   | `PostApiExtendAudioData['body']`         | The request body.                          |

### Body Properties

| Name          | Type   | Description                                                                          |
| ------------- | ------ | ------------------------------------------------------------------------------------ |
| `audio_id`    | string | The ID of the audio clip to extend.                                                  |
| `prompt`      | string | (Optional) Detailed prompt, including information such as music lyrics.              |
| `continue_at` | string | (Optional) Extend a new clip from a song at `mm:ss` (e.g. `00:30`). Defaults to the end. |
| `title`       | string | (Optional) Music title.                                                              |
| `tags`        | string | (Optional) Music genre.                                                              |
| `negative_tags` | string | (Optional) Negative music genre.                                                     |
| `model`       | string | (Optional) Model name, defaults to `chirp-v3-5`.                                     |

## Returns

A promise that resolves to an `AudioInfo` object for the extended audio clip. 