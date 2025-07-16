# searchUsersByEmail

The `searchUsersByEmail` function finds multiple users in a Slack workspace by their email addresses.

## Parameters

| Name   | Type       | Description                                  |
| :----- | :--------- | :------------------------------------------- |
| emails | string[]   | An array of email addresses of the users to find. |

## Returns

A promise that resolves to an array of user objects. If a user is not found, the corresponding entry in the array will be `undefined`.

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function findUsers() {
  try {
    const users = await client.searchUsersByEmail({
      emails: ['user1@example.com', 'user2@example.com'],
    });
    if (users) {
      users.forEach(user => {
        if (user) {
          console.log(`Found user: ${user.real_name}`);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

findUsers();
```

## Arguments

This method accepts an object with the following properties:

-   `emails` (string[], required): An array of email addresses of the users to find.

## Response

This method returns an array of `user` objects. For the schema of the `user` object, please refer to the `getUserInfo` function documentation. 