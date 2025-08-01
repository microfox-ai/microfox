# createChannel

The `createChannel` function creates a new channel in a Slack workspace.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function createNewChannel() {
  try {
    // Basic channel creation
    const newChannel = await client.createChannel({
      name: 'new-exciting-project',
      isPrivate: true,
    });
    console.log(`Channel created: ${newChannel.channel.name} (${newChannel.channel.id})`);

    // Create channel with users
    const projectChannel = await client.createChannel({
      name: 'project-alpha',
      isPrivate: true,
      join: true,
      userIds: ['U1234567890', 'U0987654321']
    });
    console.log(`Project channel created with users`);
  } catch (error) {
    console.error(error);
  }
}

createNewChannel();
```

## Arguments

This method accepts an object with the following properties:

| Name      | Type     | Description                                                     |
| :-------- | :------- | :-------------------------------------------------------------- |
| name      | String   | **Required**. The name of the channel to create.                |
| isPrivate | Boolean  | **Optional**. Whether the channel should be private. Defaults to `false`. |
| join      | Boolean  | **Optional**. Whether the bot should join the channel. Defaults to `true`. |
| userIds   | String[] | **Optional**. Array of user IDs to add to the channel after creation. |

## Response

This method returns a `ConversationsCreateResponse` object containing information about the newly created channel.

### ConversationsCreateResponse Object Schema

| Property     | Type    | Description                                                    |
| ------------ | ------- | -------------------------------------------------------------- |
| `ok`         | Boolean | `true` if the request was successful.                          |
| `channel`    | Object  | Channel object containing information about the created channel. See Channel Object Schema below. |
| `error`      | String  | Error message if the creation failed. Only present when `ok` is `false`. |
| `needed`     | String  | Required scope that was missing. Only present when `ok` is `false`. |
| `provided`   | String  | Provided scope. Only present when `ok` is `false`. |

### Channel Object Schema

| Property                | Type    | Description                                                        |
| ----------------------- | ------- | ------------------------------------------------------------------ |
| `id`                    | String  | The ID of the channel.                                             |
| `name`                  | String  | The name of the channel.                                           |
| `is_channel`            | Boolean | Indicates if the object represents a channel.                      |
| `is_group`              | Boolean | Indicates if the object represents a private channel.              |
| `is_im`                 | Boolean | Indicates if the object represents a direct message conversation.  |
| `is_mpim`               | Boolean | Indicates if the object represents a multi-person direct message.  |
| `is_private`            | Boolean | Indicates if the channel is private.                               |
| `created`               | Integer | A Unix timestamp indicating when the channel was created.          |
| `creator`               | String  | The ID of the user who created the channel.                        |
| `is_archived`           | Boolean | Indicates if the channel is archived.                              |
| `is_general`            | Boolean | Indicates if the channel is the default "general" channel.         |
| `is_member`             | Boolean | Indicates if the calling user is a member of the channel.          |
| `is_shared`             | Boolean | Indicates if the channel is shared with other workspaces.          |
| `is_ext_shared`         | Boolean | Indicates if the channel is part of an external shared connection. |
| `is_org_shared`         | Boolean | Indicates if the channel is shared with the entire organization.   |
| `is_pending_ext_shared` | Boolean | Indicates if the channel is ready to become externally shared.     |
| `name_normalized`       | String  | The channel name, but with any special characters replaced.        |
| `num_members`           | Integer | The number of members in the channel.                              |
| `unlinked`              | Integer | Timestamp when the channel was unlinked.                          |
| `pending_shared`        | Array   | List of team IDs that have been invited but haven't joined.       |
| `topic`                 | Object  | Object containing topic information. Contains `value`, `creator`, and `last_set` fields. |
| `purpose`               | Object  | Object containing purpose information. Contains `value`, `creator`, and `last_set` fields. |
| `previous_names`        | Array   | Array of strings representing previous names the channel had.      |
