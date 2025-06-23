# reactions.add

The `reactions.add` method adds a reaction to an item.

## Usage

You can call this method using the `WebClient` object.

```typescript
import { WebClient } from '@microfox/slack-web';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

(async () => {
  const channelId = 'C024BE91L';
  const timestamp = '1405894322.002768';
  try {
    await web.reactions.add({
      channel: channelId,
      name: 'thumbsup',
      timestamp: timestamp,
    });
    console.log('Reaction added');
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts the following arguments:

*   `channel` (string): Channel where the message to add reaction to was posted.
*   `name` (string): Reaction (emoji) name.
*   `timestamp` (string): Timestamp of the message to add reaction to.

## Response

A successful call returns an object with an `ok` property.

```json
{
    "ok": true
}
```

### Error Response

```json
{
    "ok": false,
    "error": "already_reacted"
}
```

## Errors

| Error | Description |
| --- | --- |
| `already_reacted` | The specified item already has the user/reaction combination. |
| `bad_timestamp` | Value passed for `timestamp` was invalid. |
| `channel_not_found` | Value passed for `channel` is invalid. |
| `invalid_name` | Value passed for `name` was invalid. |
| `is_archived` | Channel specified has been archived. |
| `message_not_found` | Message specified by `channel` and `timestamp` does not exist. |
| `no_item_specified` | `channel` and `timestamp` was not specified. |
| `not_reactable` | The item specified cannot be reacted to. |
| `thread_locked` | Reactions are disabled as the specified message is part of a locked thread. |
| `too_many_emoji` | The limit for distinct reactions on the item has been reached. |
| `too_many_reactions` | The limit for reactions a person may add to the item has been reached. |
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