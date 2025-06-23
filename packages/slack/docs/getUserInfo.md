# getUserInfo

The `getUserInfo` method gets detailed information about a user.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const userInfo = await client.getUserInfo('U12345678');
    console.log(userInfo);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `userId` (string): The ID of the user to get information for.

## Response

This method returns a `user` object.

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

</rewritten_file> 