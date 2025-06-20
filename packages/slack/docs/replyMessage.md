# replyMessage

The `replyMessage` method sends a reply to a message in a thread.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.replyMessage('C12345678', '1234567890.123456', 'This is a threaded reply!');
    console.log('Reply sent: ', result.ts);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `channelId` (string): The ID of the channel where the message is.
-   `thread_ts` (string): The timestamp of the message to reply to, which identifies the thread.
-   `text` (string): The text of the reply.

## Response

This method returns an object containing the result of the API call.

### Response Schema

| Property  | Type   | Description                                                                                              |
| --------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `ok`      | Boolean| `true` if the request was successful.                                                                    |
| `channel` | String | The ID of the channel where the message was posted.                                                      |
| `ts`      | String | The timestamp of the message.                                                                            |
| `message` | Object | An object containing the details of the sent message. See Message Object Schema below.                   |

### Message Object Schema

| Property    | Type    | Description                                                     |
| ----------- | ------- | --------------------------------------------------------------- |
| `type`      | String  | The type of message.                                            |
| `subtype`   | String  | The subtype of the message.                                     |
| `text`      | String  | The text of the message.                                        |
| `ts`        | String  | The timestamp of the message.                                   |
| `bot_id`    | String  | The ID of the bot that sent the message.                        |
| `username`  | String  | The username of the bot that sent the message.                  |
| `attachments` | Array | An array of attachments.                                        |
``` 