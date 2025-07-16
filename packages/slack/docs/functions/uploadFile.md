# uploadFile

The `uploadFile` function uploads a file to a Slack channel using a three-step process:

1.  It retrieves an upload URL from Slack.
2.  It uploads the file to that URL.
3.  It finalizes the upload with Slack, making the file available in the specified channel.

## Parameters

| Name           | Type   | Description                                                                 |
| :------------- | :----- | :-------------------------------------------------------------------------- |
| filename       | string | The name of the file.                                                       |
| file           | Buffer | A Buffer containing the file content.                                       |
| channelId      | string | _Optional_. The ID of the channel to upload the file to.                    |
| alt_text       | string | _Optional_. Description of the image for screen-readers.                    |
| snippet_type   | string | _Optional_. Syntax type of the snippet being uploaded.                      |
| initialComment | string | _Optional_. The message text introducing the file in specified channels.    |
| title          | string | _Optional_. An optional title for the file.                                 |

## Returns

A promise that resolves to an array of file objects for the uploaded file.

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';
import * as fs from 'fs';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function uploadMyFile() {
  try {
    const fileContent = fs.readFileSync('path/to/your/file.txt');
    const channelId = 'C1234567890'; // Replace with a real channel ID
    const uploadedFiles = await client.uploadFile({
      filename: 'file.txt',
      file: fileContent,
      channelId,
      title: 'My Text File',
      initialComment: 'Here is the file I wanted to share.',
    });
    console.log('File uploaded successfully:', uploadedFiles);
  } catch (error) {
    console.error(error);
  }
}

uploadMyFile();
``` 