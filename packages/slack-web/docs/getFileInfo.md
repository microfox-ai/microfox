# getFileInfo

The `getFileInfo` method gets information about a file.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack-web';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const fileInfo = await client.getFileInfo('F12345678');
    console.log(fileInfo);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `fileId` (string): The ID of the file to get information for.

## Response

This method returns a `file` object.

### File Object Schema

| Field               | Type           | Description                                                                                             |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| `id`                | String         | The ID of the file object.                                                                              |
| `created`           | Unix timestamp | A Unix timestamp representing when the file was created.                                                |
| `timestamp`         | Unix timestamp | A deprecated property that is provided only for backwards compatibility with older clients.             |
| `name`              | String         | Name of the file; may be null for unnamed files.                                                        |
| `title`             | String         | Title of the file.                                                                                      |
| `mimetype`          | String         | The file's mimetype.                                                                                    |
| `filetype`          | String         | The file's type.                                                                                        |
| `pretty_type`       | String         | A human-readable version of the type.                                                                   |
| `user`              | String         | The ID of the user who created the object.                                                              |
| `editable`          | Boolean        | Indicates that files are stored in editable mode.                                                       |
| `size`              | Integer        | The filesize in bytes.                                                                                  |
| `mode`              | String         | One of the following: `hosted`, `external`, `snippet` or `post`.                                        |
| `is_external`       | Boolean        | Indicates whether the master copy of a file is stored within the system or not.                         |
| `external_type`     | String         | Indicates what kind of external file it is, e.g. `dropbox` or `gdoc`.                                   |
| `is_public`         | Boolean        | `true` if the file is public.                                                                           |
| `public_url_shared` | Boolean        | `true` if the file's public URL has been shared.                                                        |
| `url_private`       | String         | A URL to the file contents. This requires an authorization header to access.                            |
| `permalink`         | String         | A URL to a page for the file containing details, comments and a download link.                          |
| `channels`          | Array          | Contains the IDs of any channels into which the file is currently shared.                               |
| `groups`            | Array          | Contains the IDs of any private groups into which the file is currently shared.                         |
| `ims`               | Array          | Contains the IDs of any IM channels into which the file is currently shared.                            |
| `comments_count`    | Integer        | The number of comments on the file.                                                                     |

</rewritten_file> 