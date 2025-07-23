# messageUsers

Sends a direct message to multiple users, with support for templating.

## Arguments

| Name | Type | Description |
| --- | --- | --- |
| `userIds` | `string[]` | An array of user IDs to send the message to. |
| `text` | `string` | The message text. Can include template variables. |
| `username` | `string` (optional) | The username for the message. Defaults to the one set in environment variables if not provided. |
| `icon_url` | `string` (optional) | The icon URL for the message. Defaults to the one set in environment variables if not provided. |

## Template Variables

The `text` argument can contain the following template variables, which will be replaced with the user's information:

* `{mention}`: Mentions the user (e.g., `<@U12345678>`).
* `{user_name}`: The user's display name.
* `{user_email}`: The user's email address.
* `{user_title}`: The user's title.
* `{first_name}`: The user's first name.
* `{last_name}`: The user's last name.

## Example

### Simple Message

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function sendSimpleMessages() {
  try {
    const response = await client.messageUsers({
      userIds: ['U1234567890', 'U0987654321'],
      text: 'This is a bulk message to all users.',
      username: 'BulkSender',
      icon_url: 'http://example.com/icon.png',
    });
    console.log('Messages sent:', response);
  } catch (error) {
    console.error('Error sending messages:', error);
  }
}

sendSimpleMessages();
```

### Templated Message

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function sendTemplatedMessages() {
  try {
    const response = await client.messageUsers({
      userIds: ['U1234567890', 'U0987654321'],
      text: 'Hi {first_name}, this is a personalized message for you!',
    });
    console.log('Personalized messages sent:', response);
  } catch (error) {
    console.error('Error sending personalized messages:', error);
  }
}

sendTemplatedMessages();
```

## Response

This method returns an array of `ChatPostMessageResponse` objects representing the successful message sends.

### ChatPostMessageResponse Object Schema

| Property  | Type    | Description                                                                    |
| --------- | ------- | ------------------------------------------------------------------------------ |
| `ok`      | Boolean | `true` if the request was successful.                                          |
| `channel` | String  | The ID of the channel where the message was posted.                            |
| `ts`      | String  | The timestamp of the message.                                                  |
| `message` | Object  | Object containing the details of the sent message. See Message Object Schema below. |
| `error`   | String  | Error message if the request failed. Only present when `ok` is `false`.       |

### Message Object Schema

| Property      | Type    | Description                                    |
| ------------- | ------- | ---------------------------------------------- |
| `type`        | String  | The type of message.                           |
| `subtype`     | String  | The subtype of the message.                    |
| `text`        | String  | The text of the message.                       |
| `ts`          | String  | The timestamp of the message.                  |
| `bot_id`      | String  | The ID of the bot that sent the message.       |
| `username`    | String  | The username of the bot that sent the message. |
| `user`        | String  | The ID of the user who sent the message.       |
| `team`        | String  | The ID of the team.                            |
| `attachments` | Array   | Array of attachment objects.                   |
| `blocks`      | Array   | Array of block kit objects.                    | 
