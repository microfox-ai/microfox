# addUserToChannel

The `addUserToChannel` method adds a user to a channel.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.addUserToChannel({
      channelId: 'C12345678',
      userId: 'U12345678',
    });
    if (result.ok) {
      console.log('User added to channel.');
    }
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts an object with the following properties:

-   `channelId` (string, required): The ID of the channel to add the user to.
-   `userId` (string, required): The ID of the user to add.

## Response

This method returns an object containing the result of the API call.

### Response Schema

| Property     | Type    | Description                                                                  |
| ------------ | ------- | ---------------------------------------------------------------------------- |
| `ok`         | Boolean | `true` if the request was successful.                                        |
| `channel`    | Object  | An object containing information about the channel. See Channel Object below. |

### Channel Object

| Property                 | Type    | Description                                                        |
| ------------------------ | ------- | ------------------------------------------------------------------ |
| `id`                     | String  | The ID of the channel.                                             |
| `name`                   | String  | The name of the channel.                                           |
| `is_channel`             | Boolean | Indicates if the object represents a channel.                      |
| `is_group`               | Boolean | Indicates if the object represents a private channel.              |
| `is_im`                  | Boolean | Indicates if the object represents a direct message conversation.  |
| `created`                | Integer | A Unix timestamp indicating when the channel was created.          |
| `creator`                | String  | The ID of the user who created the channel.                        |
| `is_archived`            | Boolean | Indicates if the channel is archived.                              |
| `is_general`             | Boolean | Indicates if the channel is the default "general" channel.         |
| `unlinked`               | Integer |                                                                    |
| `name_normalized`        | String  | The channel name, but with any special characters replaced.        |
| `is_shared`              | Boolean | Indicates if the channel is shared with other workspaces.          |
| `is_ext_shared`          | Boolean | Indicates if the channel is part of an external shared connection. |
| `is_org_shared`          | Boolean | Indicates if the channel is shared with the entire organization.   |
| `pending_shared`         | Array   |                                                                    |
| `is_pending_ext_shared`  | Boolean |                                                                    |
| `is_member`              | Boolean | Indicates if the calling user is a member of the channel.          |
| `is_private`             | Boolean | Indicates if the channel is private.                               |
| `is_mpim`                | Boolean | Indicates if the object represents a multi-person direct message.  |
| `topic`                  | Object  | An object containing the channel's topic information.              |
| `purpose`                | Object  | An object containing the channel's purpose information.            |
| `previous_names`         | Array   | A list of any previous names the channel had.                      |
| `num_members`            | Integer | The number of members in the channel.                              |
| `last_read`              | String  | The timestamp of the last message the user read in the channel.    |
| `latest`                 | Object  | The latest message in the channel.                                 |
| `unread_count`           | Integer | The number of unread messages for the user in the channel.         |
| `unread_count_display`   | Integer | The number of unread messages to display for the user.             |
| `is_open`                | Boolean | Indicates if the channel is open for the user.                     | 