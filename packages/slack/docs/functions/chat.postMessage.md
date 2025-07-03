# chat.postMessage

The `chat.postMessage` method sends a message to a channel.

## Usage

You can call this method using the `WebClient` object.

```typescript
import { WebClient } from '@microfox/slack';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

(async () => {
  const conversationId = 'C12345678';
  try {
    const result = await web.chat.postMessage({
      channel: conversationId,
      text: 'Hello world!',
      // You can also use blocks for more interactive messages
      // blocks: [...]
    });
    console.log(`Successfully sent message ${result.ts} in conversation ${conversationId}`);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts a variety of arguments to customize the message.

### Required Arguments

-   `channel` (string): Channel, private group, or IM channel ID to send message to. Can be an encoded ID, or a channel name. Example: `C1234567890`

*At least one of the following is required:*

-   `text` (string): The formatted text of the message to be published. If `blocks` are included, this will be used as fallback text for notifications.
-   `attachments` (string): A JSON-based array of structured attachments, presented as a URL-encoded string.
-   `blocks` (string): A JSON-based array of structured blocks, presented as a URL-encoded string.

### Optional Arguments

-   `as_user` (boolean): Pass true to post the message as the authed user, instead of as a bot. Defaults to `false`. (Legacy)
-   `icon_emoji` (string): Emoji to use as the icon for this message. Overrides `icon_url`. Example: `:chart_with_upwards_trend:`
-   `icon_url` (string): URL to an image to use as the icon for this message.
-   `link_names` (boolean): Find and link user groups.
-   `mrkdwn` (boolean): Disable Slack markup parsing by setting to `false`. Enabled by default.
*   `metadata` (string): JSON object with `event_type` and `event_payload` fields, presented as a URL-encoded string.
-   `parse` (string): Change how messages are treated. Defaults to `none`.
-   `reply_broadcast` (boolean): Used in conjunction with `thread_ts` and indicates whether reply should be made visible to everyone in the channel or conversation. Defaults to `false`.
-   `thread_ts` (string): The `ts` value of another message to reply to.
-   `unfurl_links` (boolean): Pass `true` to enable unfurling of primarily text-based content.
-   `unfurl_media` (boolean): Pass `false` to disable unfurling of media content.
-   `username` (string): Set your bot's user name.

## Response

A successful call returns an object with the message details.

### Response Schema

| Property  | Type   | Description                                                     |
| --------- | ------ | --------------------------------------------------------------- |
| `ok`      | Boolean| `true` if the request was successful.                           |
| `channel` | String | The ID of the channel where the message was posted.             |
| `ts`      | String | The timestamp of the message.                                   |
| `message` | Object | An object containing the details of the sent message.           |

### Error Response
```json
{
    "ok": false,
    "error": "too_many_attachments"
}
```

## Errors

This table lists the expected errors that this method could return.

| Error | Description |
| --- | --- |
| `account_inactive` | Authentication token is for a deleted user or workspace. |
| `as_user_not_supported` | The `as_user` parameter does not function with workspace apps. |
| `channel_not_found` | Value passed for `channel` was invalid. |
| `duplicate_channel_not_found` | Channel associated with `client_msg_id` was invalid. |
| `duplicate_message_not_found` | No duplicate message exists associated with `client_msg_id`. |
| `ekm_access_denied` | Administrators have suspended the ability to post a message. |
| `invalid_blocks` | Blocks submitted with this message are not valid. |
| `invalid_blocks_format` | The `blocks` is not a valid JSON object or doesn't match the Block Kit syntax. |
| `invalid_metadata_format` | Invalid metadata format provided. |
| `invalid_metadata_schema` | Invalid metadata schema provided. |
| `is_archived` | Channel has been archived. |
| `message_limit_exceeded` | Members on this team are sending too many messages. |
| `messages_tab_disabled` | Messages tab for the app is disabled. |
| `metadata_must_be_sent_from_app` | Message metadata can only be posted or updated using an app-level token. |
| `metadata_too_large` | Metadata exceeds size limit. |
| `msg_blocks_too_long` | Blocks submitted with this message are too long. |
| `no_text` | No message text provided. |
| `not_in_channel` | Cannot post user messages to a channel they are not in. |
| `rate_limited` | Application has posted too many messages. |
| `restricted_action` | A workspace preference prevents the authenticated user from posting. |
| `restricted_action_non_threadable_channel` | Cannot post thread replies into a non-threadable channel. |
| `restricted_action_read_only_channel` | Cannot post any message into a read-only channel. |
| `restricted_action_thread_locked` | Cannot post replies to a thread that has been locked by admins. |
| `restricted_action_thread_only_channel` | Cannot post top-level messages into a thread-only channel. |
| `slack_connect_canvas_sharing_blocked` | Admin has disabled Canvas File sharing in all Slack Connect communications. |
| `slack_connect_file_link_sharing_blocked` | Admin has disabled Slack File sharing in all Slack Connect communications. |
| `slack_connect_lists_sharing_blocked` | Admin has disabled Lists sharing in all Slack Connect communications. |
| `team_access_not_granted` | The token used is not granted the specific workspace access required to complete this request. |
| `too_many_attachments` | Too many attachments were provided with this message. A maximum of 100 attachments are allowed on a message. |
| `too_many_contact_cards` | Too many contact_cards were provided with this message. A maximum of 10 contact cards are allowed on a message. |
| `access_denied` | Access to a resource specified in the request is denied. |
| `invalid_auth` | Some aspect of authentication cannot be validated. |
| `missing_scope` | The token used is not granted the specific scope permissions required to complete this request. |
| `not_authed` | No authentication token provided. |
| `no_permission` | The workspace token used in this request does not have the permissions necessary to complete the request. |
| `token_expired` | Authentication token has expired. |
| `token_revoked` | Authentication token is for a deleted user or workspace or the app has been removed. |
| `fatal_error` | The server could not complete your operation(s) without encountering a catastrophic error. |
| `internal_error` | The server could not complete your operation(s) without encountering an error. |
| `invalid_arguments` | The method was called with invalid arguments. |
| `invalid_arg_name` | The method was passed an argument whose name falls outside the bounds of accepted or expected values. |
| `request_timeout` | The method was called via a POST request, but the POST data was either missing or truncated. |
| `service_unavailable` | The service is temporarily unavailable. |

</rewritten_file> 