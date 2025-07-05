# postApiGenerate

Generate audio based on a prompt. It will automatically fill in the lyrics.

## Usage

```typescript
import { createClient, postApiGenerate } from '@microfox/suno-api';

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

## Input

The `body` object accepts the following properties:

| Name                | Type    | Required | Description                                                                |
| ------------------- | ------- | -------- | -------------------------------------------------------------------------- |
| `prompt`            | string  | Yes      | Prompt for the music generation.                                           |
| `make_instrumental` | boolean | Yes      | Whether to generate instrumental music.                                    |
| `wait_audio`        | boolean | Yes      | Whether to wait for music generation. Defaults to `false`.                 |
| `model`             | string  | No       | Model name, defaults to `chirp-v3-5`.                                      |

## Output

Returns an array of two `audio_info` objects.

### audio_info object

| Name                   | Type   | Description                                                                                              |
| ---------------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `id`                   | string | Audio ID.                                                                                                |
| `title`                | string | Music title.                                                                                             |
| `image_url`            | string | Music cover image URL.                                                                                   |
| `lyric`                | string | Music lyrics.                                                                                            |
| `audio_url`            | string | Music download URL.                                                                                      |
| `video_url`            | string | Music video download link.                                                                               |
| `created_at`           | string | Creation timestamp.                                                                                      |
| `model_name`           | string | Suno model name used.                                                                                    |
| `status`               | string | Generation status (e.g., `submitted`, `complete`).                                                       |
| `gpt_description_prompt`| string | Suno's internal prompt generated from user input.                                                        |
| `prompt`               | string | The final prompt used for generation.                                                                    |
| `type`                 | string | Type of content.                                                                                         |
| `tags`                 | string | Music genre tags.                                                                                        | 