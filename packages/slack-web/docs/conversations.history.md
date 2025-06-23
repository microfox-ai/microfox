# conversations.history

The `conversations.history` method fetches a conversation's history of messages and events.

## Usage

You can call this method using the `WebClient` object.

```typescript
import { WebClient } from '@microfox/slack-web';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

(async () => {
  const channelId = 'C024BE91L';
  try {
    const result = await web.conversations.history({
      channel: channelId,
    });
    console.log(result.messages);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts the following arguments:

*   `channel` (string): Conversation ID to fetch history for.
*   `cursor` (string): Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request.
*   `include_all_metadata` (boolean): Return all metadata associated with this message. Default `false`.
*   `inclusive` (boolean): Include messages with `oldest` or `latest` timestamps in results. Ignored unless either timestamp is specified.
*   `latest` (string): Only messages before this Unix timestamp will be included in results.
*   `limit` (number): The maximum number of items to return.
*   `oldest` (string): Only messages after this Unix timestamp will be included in results.

## Response

A successful call returns an object with a `messages` array.

### Response Schema

| Property            | Type    | Description                                                                 |
| ------------------- | ------- | --------------------------------------------------------------------------- |
| `ok`                | Boolean | `true` if the request was successful.                                       |
| `messages`          | Array   | An array of `message` objects. See Message Object Schema below.             |
| `has_more`          | Boolean | `true` if there are more messages to retrieve.                              |
| `pin_count`         | Integer | The number of pinned messages in the channel.                               |
| `response_metadata` | Object  | An object containing pagination information.                                |

### Message Object Schema

| Property | Type   | Description                                           |
| -------- | ------ | ----------------------------------------------------- |
| `type`   | String | The type of message.                                  |
| `user`   | String | The ID of the user who sent the message.              |
| `text`   | String | The text of the message.                              |
| `ts`     | String | The timestamp of the message.                         |

### Error Response

```json
{
    "ok": false,
    "error": "channel_not_found"
}
```

## Errors

| Error | Description |
| --- | --- |
| `channel_not_found` | Value passed for `channel` was invalid. |
| `invalid_cursor` | Value passed for `cursor` was not valid or is no longer valid. |
| `invalid_ts_latest` | Value passed for `latest` was invalid. |
| `invalid_ts_oldest` | Value passed for `oldest` was invalid. |
| `not_in_channel` | The token used does not have access to the proper channel. |
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
| `accesslimited` | Access to this method is limited on the current network |
| `fatal_error` | The server could not complete your operation(s) without encountering a catastrophic error. |
| `internal_error` | The server could not complete your operation(s) without encountering an error. |
| `service_unavailable` | The service is temporarily unavailable. |
| `team_added_to_org` | The workspace associated with your request is currently undergoing migration to an Enterprise Organization. | 