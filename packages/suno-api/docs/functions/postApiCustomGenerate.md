# postApiCustomGenerate

Generate Audio - Custom Mode. The custom mode enables users to provide additional details about the music, such as music genre, lyrics, and more.

## Usage

```typescript
import { createClient, postApiCustomGenerate } from '@microfox/suno-api';

const client = createClient({
  // The Suno API requires an API key for authentication.
  // Pass it in the headers.
  headers: {
    'suno-api-key': 'YOUR_SUNO_API_KEY'
  },
  // You can optionally provide a base URL if you are self-hosting the API
  baseUrl: 'https://your-suno-api-proxy.com'
});

async function customGenerate() {
  try {
    const response = await postApiCustomGenerate({
      client: client,
      body: {
        prompt: "[Verse 1]\\nCruel flames of war engulf this land...",
        tags: "pop metal male melancholic",
        title: "Silent Battlefield",
        make_instrumental: false,
        wait_audio: false
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

customGenerate();
```

## Input

The `body` object accepts the following properties:

| Name                | Type    | Required | Description                                                                                               |
| ------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `prompt`            | string  | Yes      | Detailed prompt, including information such as music lyrics.                                              |
| `tags`              | string  | Yes      | Music genre.                                                                                              |
| `title`             | string  | Yes      | Music title.                                                                                              |
| `make_instrumental` | boolean | No       | Whether to generate instrumental music.                                                                   |
| `model`             | string  | No       | Model name, defaults to `chirp-v3-5`.                                                                     |
| `wait_audio`        | boolean | No       | Whether to wait for music generation. Defaults to `false`.                                                |
| `negative_tags`     | string  | No       | Negative music genre tags to avoid.                                                                       |

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