# addUsersToChannel

The `addUsersToChannel` function adds multiple users to a Slack channel at once. It efficiently handles bulk user additions with automatic fallback to individual invites if needed.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function addMultipleUsers() {
  try {
    const results = await client.addUsersToChannel({
      channelId: 'C1234567890',
      userIds: ['U1234567890', 'U0987654321', 'U1122334455']
    });
    
    console.log(`Successfully processed ${results.length} invite requests`);
    results.forEach((result, index) => {
      console.log(`User ${index + 1}: ${result.ok ? 'Success' : 'Failed'}`);
    });
  } catch (error) {
    console.error(error);
  }
}

addMultipleUsers();
```

## Arguments

This method accepts an object with the following properties:

| Name      | Type     | Description                                        |
| :-------- | :------- | :------------------------------------------------- |
| channelId | String   | **Required**. The ID of the channel to add users to. Channel IDs start with 'C'. |
| userIds   | String[] | **Required**. Array of user IDs to add to the channel. User IDs start with 'U'. |

## Response

This method returns an array of `ConversationsInviteResponse` objects representing the invite responses for each user.

### ConversationsInviteResponse Object Schema

| Property     | Type    | Description                                                    |
| ------------ | ------- | -------------------------------------------------------------- |
| `ok`         | Boolean | `true` if the request was successful for this user.            |
| `channel`    | Object  | Channel object containing information about the target channel. See Channel Object Schema below. |
| `error`      | String  | Error message if the invite failed. Only present when `ok` is `false`. |
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
| `name_normalized`       | String  | The channel name, but with any special characters replaced.        |
| `num_members`           | Integer | The number of members in the channel.                              |
| `topic`                 | Object  | Object containing topic information. Contains `value`, `creator`, and `last_set` fields. |
| `purpose`               | Object  | Object containing purpose information. Contains `value`, `creator`, and `last_set` fields. | 