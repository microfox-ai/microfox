# listUserIdsMap

The `listUserIdsMap` function retrieves a list of all active users in a Slack workspace and returns an array of objects, where each object contains the ID, name, and email of a user.

## Parameters

| Name        | Type    | Description                                                     |
| :---------- | :------ | :-------------------------------------------------------------- |
| includeBots | boolean | _Optional_. Whether to include bot users in the list. Defaults to `false`. |
| cursor      | string  | _Optional_. A cursor for pagination.                               |
| limit       | number  | _Optional_. The maximum number of users to return. Defaults to 100. |

## Returns

A promise that resolves to an array of objects, where each object has the following properties:

-   `id` (string): The unique identifier for the user.
-   `name` (string): The username of the user.
-   `email` (string): The email address of the user.

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function logUserIds() {
  try {
    const userMap = await client.listUserIdsMap({ limit: 50, includeBots: true });
    if (userMap) {
      userMap.forEach(user => {
        console.log(`User: ${user.name}, ID: ${user.id}, Email: ${user.email}`);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

logUserIds();
```

## Arguments

This method accepts an optional object with the following properties:

-   `includeBots` (boolean, optional): Whether to include bot users in the list. Defaults to `false`.
-   `cursor` (string, optional): A cursor for pagination. Use the `next_cursor` value from a previous response to fetch the next page of results.
-   `limit` (number, optional): The maximum number of users to return per page. Defaults to `100`.

## Response

This method returns an array of objects, each containing the following properties:

| Property | Type   | Description                      |
| :------- | :----- | :------------------------------- |
| `id`     | String | The unique identifier for the user. |
| `name`   | String | The username of the user.        |
| `email`  | String | The email address of the user.   | 