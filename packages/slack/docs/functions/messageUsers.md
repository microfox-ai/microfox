# messageUsers

The `messageUsers` method sends a direct message to multiple users.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.messageUsers({
      userIds: ['U12345678', 'U87654321'],
      text: 'Hello there!',
    });
    console.log('Messages sent: ', result.map(r => r.ts));
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts an object with the following properties:

-   `userIds` (array of strings, required): The IDs of the users to send the a message to.
-   `text` (string, required): The text of the message.

## Response

This method returns an array of objects, each containing the result of the API call for each user.

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
