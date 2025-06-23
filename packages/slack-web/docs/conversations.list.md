# conversations.list

The `conversations.list` method retrieves a list of conversations (channels, private channels, DMs, and MPDMs) in a workspace.

## Usage

You can call this method using the `WebClient` object.

```typescript
import { WebClient } from '@microfox/slack-web';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

(async () => {
  try {
    const result = await web.conversations.list({
      // Add any desired parameters here
    });
    console.log(result.channels);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts the following arguments:

-   `cursor` (string): Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request.
-   `exclude_archived` (boolean): Set to `true` to exclude archived channels from the list. Default is `false`.
-   `limit` (number): The maximum number of items to return. Must be an integer under 1000. Default is 100.
-   `team_id` (string): Required for org-wide apps.
-   `types` (string): A comma-separated list of conversation types to include. Types can be `public_channel`, `private_channel`, `mpim`, and `im`. Default is `public_channel`.

## Response

A successful call returns an object with a `channels` array.

### Response Schema

| Property            | Type    | Description                                                                 |
| ------------------- | ------- | --------------------------------------------------------------------------- |
| `ok`                | Boolean | `true` if the request was successful.                                       |
| `channels`          | Array   | An array of `conversation` objects. See Conversation Object Schema below.     |
| `response_metadata` | Object  | An object containing pagination information.                                |

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
    "error": "invalid_auth"
}
```

## Errors

This table lists the expected errors that this method could return.

| Error | Description |
| --- | --- |
| `invalid_cursor` | Value passed for `cursor` was not valid or is no longer valid. |
| `invalid_limit` | Value passed for `limit` is not understood. |
| `invalid_types` | Value passed for `types` could not be used based on the method's capabilities or the permission scopes granted to the used token. |
| `method_not_supported_for_channel_type` | This type of conversation cannot be used with this method. |
| `missing_scope` | The token used is not granted the specific scope permissions required to complete this request. |
| `team_access_not_granted` | The token used is not granted the specific workspace access required to complete this request. |
| `access_denied` | Access to a resource specified in the request is denied. |
| `account_inactive` | Authentication token is for a deleted user or workspace. |
| `invalid_auth` | Some aspect of authentication cannot be validated. |
| `not_authed` | No authentication token provided. |
| `no_permission` | The workspace token used in this request does not have the permissions necessary to complete the request. |
| `token_revoked` | Authentication token is for a deleted user or workspace or the app has been removed. |
| `fatal_error` | The server could not complete your operation(s) without encountering a catastrophic error. |
| `internal_error` | The server could not complete your operation(s) without encountering an error. |
| `invalid_arguments` | The method was called with invalid arguments. |
| `invalid_arg_name` | The method was passed an argument whose name falls outside the bounds of accepted or expected values. |
| `request_timeout` | The method was called via a POST request, but the POST data was either missing or truncated. |
| `service_unavailable` | The service is temporarily unavailable. | 