# getActiveUsers

The `getActiveUsers` function retrieves a list of all active (non-deleted) users in a Slack workspace.

## Parameters

| Name        | Type    | Description                               |
| :---------- | :------ | :---------------------------------------- |
| includeBots | boolean | _Optional_. Whether to include bots in the list. Defaults to `false`. |
| cursor      | string  | _Optional_. A cursor to the next page of results. |
| limit       | number  | _Optional_. The maximum number of users to return. Defaults to 100 |

## Returns

A promise that resolves to an array of user objects.

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function logActiveUsers() {
  try {
    const users = await client.getActiveUsers({ limit: 50, includeBots: true });
    if (users) {
      users.forEach(user => {
        console.log(user.real_name);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

logActiveUsers();
```

## Arguments

This method accepts an optional object with the following properties:

| Name        | Type    | Description                               |
| :---------- | :------ | :---------------------------------------- |
| includeBots | boolean | _Optional_. Whether to include bots in the list. Defaults to `false`. |
| cursor      | string  | _Optional_. A cursor to the next page of results. |
| limit       | number  | _Optional_. The maximum number of users to return. Defaults to 100 |

## Response

This method returns an array of `user` objects. A `user` object contains information about a Slack workspace user.

### User Object Schema

| Field                             | Type          | Description                                                                                                                                                                                            |
| --------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                              | String        | Identifier for this workspace user. It is unique to the workspace containing the user.                                                                                                                |
| `team_id`                         | String        | The ID of the team the user belongs to.                                                                                                                                                                |
| `name`                            | String        | The username of the user.                                                                                                                                                                              |
| `deleted`                         | Boolean       | Indicates if the user has been deactivated. This will always be `false` for users returned by this method.                                                                                              |
| `color`                           | String        | Used in some clients to display a special username color.                                                                                                                                              |
| `real_name`                       | String        | The user's first and last name.                                                                                                                                                                        |
| `tz`                              | String        | A human-readable string for the geographic timezone-related region this user has specified in their account.                                                                                         |
| `tz_label`                        | String        | Describes the commonly used name of the `tz` timezone.                                                                                                                                                 |
| `tz_offset`                       | Integer       | Indicates the number of seconds to offset UTC time by for this user's `tz`.                                                                                                                            |
| `profile`                         | Object        | The profile object contains the default fields of a user's workspace profile. See Profile Object Schema below.                                                                                       |
| `is_admin`                        | Boolean       | Indicates whether the user is an Admin of the current workspace.                                                                                                                                       |
| `is_owner`                        | Boolean       | Indicates whether the user is an Owner of the current workspace.                                                                                                                                       |
| `is_primary_owner`                | Boolean       | Indicates whether the user is the Primary Owner of the current workspace.                                                                                                                              |
| `is_restricted`                   | Boolean       | Indicates whether or not the user is a guest user.                                                                                                                                                     |
| `is_ultra_restricted`             | Boolean       | Indicates whether or not the user is a single-channel guest.                                                                                                                                           |
| `is_bot`                          | Boolean       | Indicates whether the user is a bot user.                                                                                                                                                              |
| `is_app_user`                     | Boolean       | Indicates whether the user is an authorized user of the calling app.                                                                                                                                   |
| `updated`                         | String        | A Unix timestamp indicating when the user object was last updated.                                                                                                                                     |
| `is_email_confirmed`              | Boolean       | Indicates if the user's email address has been confirmed.                                                                                                                                              |
| `who_can_share_contact_card`      | String        | Who can share the user's contact card.                                                                                                                                                                 |
| `enterprise_user`                 | Object        | An object containing info related to an Enterprise Grid user.                                                                                                                                          |

### Profile Object Schema

| Field                     | Type    | Description                                                                                                                                                                                            |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`                   | String  | The user's title.                                                                                                                                                                                      |
| `phone`                   | String  | The user's phone number, in any format.                                                                                                                                                                |
| `skype`                   | String  | The user's Skype handle.                                                                                                                                                                               |
| `real_name`               | String  | The user's first and last name.                                                                                                                                                                        |
| `real_name_normalized`    | String  | The `real_name` field, but with any non-Latin characters filtered out.                                                                                                                                 |
| `display_name`            | String  | The display name the user has chosen to identify themselves by in their workspace profile.                                                                                                             |
| `display_name_normalized` | String  | The `display_name` field, but with any non-Latin characters filtered out.                                                                                                                              |
| `fields`                  | Object  | All the custom profile fields for the user.                                                                                                                                                            |
| `status_text`             | String  | The displayed text of up to 100 characters.                                                                                                                                                            |
| `status_emoji`            | String  | The displayed emoji that is enabled for the Slack team, such as `:train:`.                                                                                                                             |
| `status_expiration`       | Integer | The Unix timestamp of when the status will expire.                                                                                                                                                     |
| `avatar_hash`             | String  | A hash of the user's avatar.                                                                                                                                                                           |
| `start_date`              | String  | The date the person joined the organization.                                                                                                                                                           |
| `image_original`          | String  | URL to the original size of the user's profile picture.                                                                                                                                                |
| `is_custom_image`         | Boolean | Indicates if the user has a custom profile picture.                                                                                                                                                    |
| `email`                   | String  | A valid email address. Requires `users:read.email` scope.                                                                                                                                              |
| `pronouns`                | String  | The pronouns the user prefers to be addressed by.                                                                                                                                                      |
| `first_name`              | String  | The user's first name.                                                                                                                                                                                 |
| `last_name`               | String  | The user's last name.                                                                                                                                                                                  |
| `image_24`                | String  | URL to a 24x24 pixel version of the user's profile picture.                                                                                                                                            |
| `image_32`                | String  | URL to a 32x32 pixel version of the user's profile picture.                                                                                                                                            |
| `image_48`                | String  | URL to a 48x48 pixel version of the user's profile picture.                                                                                                                                            |
| `image_72`                | String  | URL to a 72x72 pixel version of the user's profile picture.                                                                                                                                            |
| `image_192`               | String  | URL to a 192x192 pixel version of the user's profile picture.                                                                                                                                           |
| `image_512`               | String  | URL to a 512x512 pixel version of the user's profile picture.                                                                                                                                           |
| `image_1024`              | String  | URL to a 1024x1024 pixel version of the user's profile picture.                                                                                                                                         |
| `status_text_canonical`   | String  |                                                                                                                                                                                                        |
| `team`                    | String  | The ID of the team the user is on.                                                                                                                                                                     | 