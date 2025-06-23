# listChannels

The `listChannels` method lists all public and private channels in a workspace.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const channels = await client.listChannels();
    console.log(channels);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method does not take any arguments.

## Response

This method returns an array of `conversation` objects.

A `conversation` object contains information about a channel-like thing in Slack. It might be a public channel, a private channel, a direct message, a multi-person direct message, or a huddle.

### Conversation Object Schema

| Property                 | Type   | Description                                                                                                                                                                                                                                        |
| ------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                     | String | The ID of the conversation.                                                                                                                                                                                                                        |
| `name`                   | String | Indicates the name of the channel-like thing, without a leading hash sign.                                                                                                                                                                         |
| `is_channel`             | Boolean| Indicates whether a conversation is a channel.                                                                                                                                                                                                     |
| `is_group`               | Boolean| Means the channel is a private channel created before March 2021.                                                                                                                                                                                  |
| `is_im`                  | Boolean| Means the conversation is a direct message between two distinguished individuals or a user and a bot.                                                                                                                                                |
| `is_mpim`                | Boolean| Represents an unnamed private conversation between multiple users.                                                                                                                                                                                   |
| `is_private`             | Boolean| Means the conversation is privileged between two or more members.                                                                                                                                                                                  |
| `created`                | Int    | Timestamp of when the conversation was created.                                                                                                                                                                                                    |
| `creator`                | String | The ID of the member that created this conversation.                                                                                                                                                                                               |
| `is_archived`            | Boolean| Indicates a conversation is archived, frozen in time.                                                                                                                                                                                              |
| `is_general`             | Boolean| Means the channel is the workspace's "general" discussion channel.                                                                                                                                                                                 |
| `unlinked`               | Int    |                                                                                                                                                                                                                                                    |
| `name_normalized`        | String | The "normalized" name of a channel, which may be different from `name` due to legacy naming rules.                                                                                                                                                   |
| `is_shared`              | Boolean| Means the conversation is in some way shared between multiple workspaces.                                                                                                                                                                          |
| `is_frozen`              | Boolean| Indicates that the channel is frozen.                                                                                                                                                                                                              |
| `is_org_shared`          | Boolean| Indicates whether this shared channel is shared between Enterprise Grid workspaces within the same organization.                                                                                                                                     |
| `is_pending_ext_shared`  | Boolean| Means the conversation is ready to become an `is_ext_shared` channel, but needs some kind of approval or sign off first.                                                                                                                            |
| `pending_shared`         | Array  | A list of team IDs that have been invited to the channel but have not yet joined.                                                                                                                                                                  |
| `context_team_id`        | String | The team ID of the team that this channel belongs to.                                                                                                                                                                                              |
| `updated`                | Int    | The timestamp, in milliseconds, when the channel settings were updated.                                                                                                                                                                            |
| `parent_conversation`    | String | The ID of the parent conversation. This is present for threaded messages.                                                                                                                                                                            |
| `is_ext_shared`          | Boolean| Indicates whether a conversation is part of a Shared Channel with a remote organization.                                                                                                                                                           |
| `shared_team_ids`        | Array  | A list of team IDs that are part of this shared channel.                                                                                                                                                                                           |
| `pending_connected_team_ids` | Array | A list of team IDs that have been invited to connect to the channel but have not yet accepted.                                                                                                                                                   |
| `is_member`              | Boolean| Indicates whether the user, bot user or Slack app associated with the token making the API call is itself a member of the conversation.                                                                                                            |
| `topic`                  | Object | Provides information about the channel topic. Contains `value`, `creator`, and `last_set` fields.                                                                                                                                                      |
| `purpose`                | Object | Provides information about the channel purpose. Contains `value`, `creator`, and `last_set` fields.                                                                                                                                                    |
| `previous_names`         | Array  | A list of previous names for the channel.                                                                                                                                                                                                          |
| `num_members`            | Int    | The number of members in the conversation. This field is only present if `include_num_members` is true in the request.                                                                                                                               |
| `locale`                 | String | The locale for this conversation. This field is only present if `include_locale` is true in the request.                                                                                                                                             |
| `last_read`              | Int    | The timestamp for the last message the calling user has read in this channel.                                                                                                                                                                      |
| `latest`                 | String | The latest message in the channel.                                                                                                                                                                                                                 |
| `unread_count`           | Int    | A full count of visible messages that the calling user has yet to read.                                                                                                                                                                              |
| `unread_count_display`   | Int    | A count of messages that the calling user has yet to read that matter to them.                                                                                                                                                                     |