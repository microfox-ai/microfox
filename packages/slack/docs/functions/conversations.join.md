# conversations.join

The `conversations.join` method allows a user to join an existing public channel.

## Usage

You can call this method using the `WebClient` object. This is essential for a bot that needs to be active in a specific channel.

```typescript
import { WebClient } from '@microfox/slack';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

(async () => {
  const channelId = 'C024BE91L'; // ID of the channel to join
  try {
    const result = await web.conversations.join({
      channel: channelId,
    });
    console.log(`Successfully joined channel ${result.channel.name}`);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts the following arguments:

-   `channel` (string): The ID of the conversation to join.

## Response

A successful call returns a `channel` object with details about the conversation.

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

### Error Response

```json
{
    "ok": false,
    "error": "is_archived"
}
```

## Errors

| Error | Description |
| --- | --- |
| `channel_not_found` | Value passed for `channel` was invalid. |
| `is_archived` | Channel has been archived and cannot be joined. |
| `method_not_supported_for_channel_type` | This method cannot be used with this type of conversation (e.g., a DM). |
| `missing_scope` | The token used is not granted the `channels:join` scope. |
| `not_authed` | No authentication token provided. |
| `invalid_auth` | Some aspect of authentication cannot be validated. |
| `account_inactive` | Authentication token is for a deleted user or workspace. |
| `token_revoked` | Authentication token is for a deleted user or workspace or the app has been removed. |
| `no_permission` | The workspace token used in this request does not have the permissions necessary to complete the request. |
| `user_is_restricted` | The user is a single-channel guest and cannot join other channels. |
| `accesslimited` | Access to this method is limited on the current network. |
| `fatal_error` | The server could not complete your operation(s) without encountering a catastrophic error. |
| `internal_error` | The server could not complete your operation(s) without encountering an error. |
| `service_unavailable` | The service is temporarily unavailable. | 