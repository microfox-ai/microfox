# users.lookupByEmail

The `users.lookupByEmail` method finds a user by their email address. This is extremely useful for integrations where you might have a user's email but not their Slack ID.

## Usage

You can call this method using the `WebClient` object.

```typescript
import { WebClient } from '@microfox/slack';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

(async () => {
  const email = 'spengler@ghostbusters.example.com';
  try {
    const result = await web.users.lookupByEmail({ email });
    console.log(`Found user: ${result.user.name}`);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts the following arguments:

-   `email` (string): An email address belonging to a user in the workspace.

## Response

A successful call returns a `user` object.

### User Object Schema

| Field                             | Type          | Description                                                                                                                                     |
| --------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                              | String        | The user's ID.                                                                                                                                  |
| `team_id`                         | String        | The ID of the team the user belongs to.                                                                                                         |
| `name`                            | String        | The user's username.                                                                                                                            |
| `deleted`                         | Boolean       | `true` if the user has been deleted.                                                                                                            |
| `color`                           | String        | A hexadecimal color code that is used to color the user's name in Slack clients.                                                                |
| `real_name`                       | String        | The user's real name.                                                                                                                           |
| `tz`                              | String        | The user's timezone (e.g., `America/Los_Angeles`).                                                                                              |
| `tz_label`                        | String        | A human-readable string for the user's timezone.                                                                                                |
| `tz_offset`                       | Integer       | The user's timezone offset in seconds.                                                                                                          |
| `profile`                         | Object        | A `profile` object containing more details about the user. See Profile Object Schema below.                                                   |
| `is_admin`                        | Boolean       | `true` if the user is an admin.                                                                                                                 |
| `is_owner`                        | Boolean       | `true` if the user is an owner.                                                                                                                 |
| `is_primary_owner`                | Boolean       | `true` if the user is the primary owner.                                                                                                        |
| `is_restricted`                   | Boolean       | `true` if the user is a restricted user (single-channel guest).                                                                                 |
| `is_ultra_restricted`             | Boolean       | `true` if the user is an ultra-restricted user (multi-channel guest).                                                                           |
| `is_bot`                          | Boolean       | `true` if the user is a bot.                                                                                                                    |
| `updated`                         | Integer       | A timestamp of when the user's profile was last updated.                                                                                        |
| `is_app_user`                     | Boolean       | `true` if the user is an app user.                                                                                                              |
| `has_2fa`                         | Boolean       | `true` if the user has two-factor authentication enabled.                                                                                       |

### Profile Object Schema

| Field                   | Type   | Description                                                                                              |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `title`                 | String | The user's title.                                                                                        |
| `phone`                 | String | The user's phone number.                                                                                 |
| `skype`                 | String | The user's Skype username.                                                                               |
| `real_name`             | String | The user's real name.                                                                                    |
| `real_name_normalized`  | String | The user's real name, normalized.                                                                        |
| `display_name`          | String | The user's display name.                                                                                 |
| `display_name_normalized`| String | The user's display name, normalized.                                                                     |
| `status_text`           | String | The user's status text.                                                                                  |
| `status_emoji`          | String | The user's status emoji.                                                                                 |
| `avatar_hash`           | String | A hash of the user's avatar image.                                                                       |
| `image_original`        | String | The URL of the user's original-sized profile image.                                                      |
| `image_24`              | String | The URL of the user's 24x24 profile image.                                                               |
| `image_32`              | String | The URL of the user's 32x32 profile image.                                                               |
| `image_48`              | String | The URL of the user's 48x48 profile image.                                                               |
| `image_72`              | String | The URL of the user's 72x72 profile image.                                                               |
| `image_192`             | String | The URL of the user's 192x192 profile image.                                                             |
| `image_512`             | String | The URL of the user's 512x512 profile image.                                                             |
| `team`                  | String | The ID of the team the user belongs to.                                                                  |

### Error Response

```json
{
    "ok": false,
    "error": "users_not_found"
}
```

## Errors

| Error | Description |
| --- | --- |
| `users_not_found` | The user with the given email address was not found. |
| `missing_scope` | The token used is not granted the `users:read.email` scope. |
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