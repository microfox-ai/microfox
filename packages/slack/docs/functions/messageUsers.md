# messageUsers

The `messageUsers` function sends direct messages to multiple users. It supports both simple text messages and templated messages with dynamic content that gets personalized for each user.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

// Simple message
async function sendSimpleMessage() {
  try {
    const results = await client.messageUsers({
      userIds: ['U1234567890', 'U0987654321'],
      text: "Hello everyone! This is a simple message."
    });
    
    console.log(`Sent ${results.length} messages`);
  } catch (error) {
    console.error(error);
  }
}

// Templated message
async function sendTemplatedMessages() {
  try {
    const results = await client.messageUsers({
      userIds: ['U1234567890', 'U0987654321'],
      text: "Hi {mention}! Your role is {user_title} and we can reach you at {user_email}."
    });
    
    console.log(`Sent ${results.length} personalized messages`);
  } catch (error) {
    console.error(error);
  }
}
```

## Arguments

This method accepts an object with the following properties:

| Name    | Type     | Description                                                     |
| :------ | :------- | :-------------------------------------------------------------- |
| userIds | String[] | **Required**. Array of user IDs to send messages to. User IDs start with 'U'. |
| text    | String   | **Required**. The message text. Can include template variables for personalization. |

### Template Variables

| Variable       | Type   | Description                                    | Fallback Logic                                |
| :------------- | :----- | :--------------------------------------------- | :-------------------------------------------- |
| `{mention}`    | String | Mentions the user (@username)                  | Always works with user.id                    |
| `{user_name}`  | String | User's display name                            | username → real_name → display_name → "User" |
| `{user_email}` | String | User's email address                           | profile.email or empty                       |
| `{user_title}` | String | User's job title                               | profile.title or empty                       |
| `{user_phone}` | String | User's phone number                            | profile.phone or empty                       |
| `{user_status}`| String | User's current status text                     | profile.status_text or empty                 |
| `{user_avatar}`| String | User's profile image URL                       | 72px → 192px → original or empty             |
| `{first_name}` | String | User's first name                              | profile.first_name → extracted from real_name → username → "User" |
| `{last_name}`  | String | User's last name                               | profile.last_name → extracted from real_name or empty |

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
