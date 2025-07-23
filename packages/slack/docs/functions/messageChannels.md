# messageChannels

Sends a message to multiple Slack channels.

## Arguments

| Name | Type | Description |
| --- | --- | --- |
| `channelIds` | `string[]` | An array of channel IDs to send the message to. |
| `text` | `string` | The text of the message. |
| `username` | `string` (optional) | The username for the message. Defaults to the one set in environment variables if not provided. |
| `icon_url` | `string` (optional) | The icon URL for the message. Defaults to the one set in environment variables if not provided. |

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function sendMessages() {
  try {
    const response = await client.messageChannels({
      channelIds: ['C1234567890', 'C0987654321'], // Replace with your channel IDs
      text: 'Hello, everyone!',
      username: 'AnnouncementBot',
      icon_url: 'http://example.com/icon.png',
    });
    console.log('Messages sent:', response);
  } catch (error) {
    console.error('Error sending messages:', error);
  }
}

sendMessages();
```

## Response

This method returns an array of objects, each containing the result of the API call for each channel.

### Response Schema (for each item in the array)

| Property  | Type    | Description                                                                    |
| --------- | ------- | ------------------------------------------------------------------------------ |
| `ok`      | Boolean | `true` if the request was successful.                                          |
| `channel` | String  | The ID of the channel where the message was posted.                            |
| `ts`      | String  | The timestamp of the message.                                                  |
| `message` | Object  | An object containing the details of the sent message. See Message Object Schema. |

### Message Object Schema

| Property      | Type    | Description                                    |
| ------------- | ------- | ---------------------------------------------- |
| `type`        | String  | The type of message.                           |
| `subtype`     | String  | The subtype of the message.                    |
| `text`        | String  | The text of the message.                       |
| `ts`          | String  | The timestamp of the message.                  |
| `bot_id`      | String  | The ID of the bot that sent the message.       |
| `username`    | String  | The username of the bot that sent the message. |
| `attachments` | Array   | An array of attachments.                       | 