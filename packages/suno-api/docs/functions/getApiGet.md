# getApiGet

Get audio information for a specific audio ID.

## Usage

```typescript
import { createClient, getApiGet } from '@microfox/suno-api';

const client = createClient();

async function getAudioInfo(audioId: string) {
  try {
    const response = await getApiGet({
      client: client,
      query: {
        ids: audioId
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getAudioInfo("your-audio-id");
```

## Input

The function accepts a `query` object with the following properties:

| Name   | Type   | Required | Description                                                               |
| ------ | ------ | -------- | ------------------------------------------------------------------------- |
| `ids`  | string | No       | Audio IDs, separated by commas. Leave blank to return all music.          |
| `page` | number | No       | Page number for pagination when `ids` is not provided.                    |

## Output

Returns an array of `audio_info` objects.

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