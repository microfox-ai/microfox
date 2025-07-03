# createChannel

The `createChannel` method creates a new public or private channel.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    // Create a public channel
    const publicChannel = await client.createChannel('new-public-channel');
    console.log('Public channel created: ', publicChannel.id);

    // Create a private channel
    const privateChannel = await client.createChannel('new-secret-channel', true);
    console.log('Private channel created: ', privateChannel.id);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `name` (string): The name of the channel to create.
-   `isPrivate` (boolean, optional): Whether the channel should be private. Defaults to `false`.

## Response

This method returns an object containing a `channel` property, which is a `conversation` object for the newly created channel.

### Conversation Object Schema

| Property                 | Type   | Description                                                                                                                              |
| ------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                     | String | The ID of the conversation.                                                                                                              |
| `name`                   | String | The name of the channel-like thing.                                                                                                      |
| `is_channel`             | Boolean| Indicates whether a conversation is a channel.                                                                                           |
| `is_group`               | Boolean| Means the channel is a private channel created before March 2021.                                                                        |
| `is_im`                  | Boolean| Means the conversation is a direct message between two distinguished individuals or a user and a bot.                                    |
| `is_mpim`                | Boolean| Represents an unnamed private conversation between multiple users.                                                                       |
| `is_private`             | Boolean| Means the conversation is privileged between two or more members.                                                                        |
| `created`                | Int    | Timestamp of when the conversation was created.                                                                                          |
| `creator`                | String | The ID of the member that created this conversation.                                                                                     |
| `is_archived`            | Boolean| Indicates a conversation is archived.                                                                                                    |
| `is_general`             | Boolean| Means the channel is the workspace's "general" discussion channel.                                                                       |
| `unlinked`               | Int    | The number of members that have been removed from the channel.                                                                           |
| `name_normalized`        | String | The channel name, but with any special characters replaced.                                                                              |
| `is_shared`              | Boolean| Indicates whether a conversation is part of a [Shared Channel](https://slack.com/help/articles/202508758-Share-channels-with-other-workspaces).|
| `is_ext_shared`          | Boolean| Indicates whether a conversation is part of a Shared Channel with a remote organization.                                                 |
| `is_org_shared`          | Boolean| Indicates whether this shared channel is shared between Enterprise Grid workspaces within the same organization.                             |
| `pending_shared`         | Array  | A list of team IDs that have been invited to the channel but have not yet joined.                                                        |
| `is_pending_ext_shared`  | Boolean| Means the conversation is ready to become an `is_ext_shared` channel, but needs some kind of approval or sign off first.                  |
| `is_member`              | Boolean| Indicates whether the user, bot user or Slack app is a member of the conversation.                                                       |
| `is_private`             | Boolean| Means the conversation is privileged between two or more members.                                                                        |
| `is_mpim`                | Boolean| Represents an unnamed private conversation between multiple users.                                                                       |
| `topic`                  | Object | Provides information about the channel topic.                                                                                            |
| `purpose`                | Object | Provides information about the channel purpose.                                                                                          |
| `previous_names`         | Array  | A list of previous names for the channel.                                                                                                |
| `num_members`            | Int    | The number of members in the conversation.                                                                                               |
