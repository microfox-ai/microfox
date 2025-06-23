# chat.update

The `chat.update` method updates an existing message in a channel.

## Usage

You can call this method using the `WebClient` object. This is useful for showing the status of a long-running task.

```typescript
import { WebClient } from '@microfox/slack-web';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

(async () => {
  const channelId = 'C12345678';
  // ts of the message to update
  const messageTs = '1629827937.002300'; 
  try {
    const result = await web.chat.update({
      channel: channelId,
      ts: messageTs,
      text: 'The process is now complete!',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Process Complete!* :white_check_mark:',
          },
        },
      ],
    });
    console.log(`Successfully updated message ${result.ts}`);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts the following arguments:

-   `channel` (string): The ID of the conversation to update the message in.
-   `ts` (string): The timestamp of the message to be updated.
-   `text` (string): The new text for the message. Required if `blocks` and `attachments` are not provided.
-   `attachments` (string): A JSON-based array of structured attachments.
-   `blocks` (array): An array of structured blocks.
-   `as_user` (boolean): Pass true to update the message as the authed user. Bot users are considered authed users.
-   `link_names` (boolean): Find and link channel names and usernames.
-   `parse` (string): Change how messages are treated. Defaults to `client`. Can be `none` or `full`.
-   `metadata` (string): A JSON object with `event_type` and `event_payload` fields.

## Response

A successful call returns an object with the updated message details.

### Response Schema

| Property  | Type   | Description                                                     |
| --------- | ------ | --------------------------------------------------------------- |
| `ok`      | Boolean| `true` if the request was successful.                           |
| `channel` | String | The ID of the channel where the message was posted.             |
| `ts`      | String | The timestamp of the message.                                   |
| `text`    | String | The new text of the message.                                    |
| `message` | Object | An object containing the details of the sent message.           |

### Error Response

```json
{
    "ok": false,
    "error": "cant_update_message"
}
```

## Errors

| Error | Description |
| --- | --- |
| `cant_update_message` | Authenticated user does not have permission to update this message. |
| `channel_not_found` | Value passed for `channel` was invalid. |
| `message_not_found` | No message exists with the requested timestamp. |
| `edit_window_closed` | The message cannot be edited due to the team message edit settings. |
| `msg_too_long` | Message text is too long. |
| `no_text` | No message text provided when `blocks` or `attachments` are also missing. |
| `as_user_not_supported` | The `as_user` parameter does not function with workspace apps. |
| `invalid_blocks` | The provided `blocks` are invalid. |
| `not_in_channel` | Cannot update a message in a channel the user is not in. |
| `is_archived` | Channel has been archived. |
| `missing_scope` | The token used is not granted the specific scope permissions required to complete this request. |
| `not_authed` | No authentication token provided. |
| `invalid_auth` | Some aspect of authentication cannot be validated. |
| `account_inactive` | Authentication token is for a deleted user or workspace. |
| `token_revoked` | Authentication token is for a deleted user or workspace or the app has been removed. |
| `no_permission` | The workspace token used in this request does not have the permissions necessary to complete the request. |
| `invalid_arg_name` | The method was passed an argument whose name falls outside the bounds of accepted or expected values. |
| `invalid_array_arg` | The method was passed an array as an argument. |
| `invalid_charset` | The method was called via a POST request, but the charset specified in the `Content-Type` header was invalid. |
| `invalid_form_data` | The method was called via a POST request with `Content-Type` `application/x-www-form-urlencoded` or `multipart/form-data`, but the form data was either missing or syntactically invalid. |
| `invalid_post_type` | The method was called via a POST request, but the specified `Content-Type` was invalid. |
| `missing_post_type` | The method was called via a POST request and included a data payload, but the request did not include a `Content-Type` header. |
| `request_timeout` | The method was called via a POST request, but the POST data was either missing or truncated. |
| `ratelimited` | The request has been ratelimited. |
| `accesslimited` | Access to this method is limited on the current network. |
| `fatal_error` | The server could not complete your operation(s) without encountering a catastrophic error. |
| `internal_error` | The server could not complete your operation(s) without encountering an error. |
| `service_unavailable` | The service is temporarily unavailable. |
| `team_added_to_org` | The workspace associated with your request is currently undergoing migration to an Enterprise Organization. | 