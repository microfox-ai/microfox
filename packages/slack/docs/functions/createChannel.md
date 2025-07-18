# createChannel

The `createChannel` function creates a new channel in a Slack workspace.

## Parameters

| Name      | Type    | Description                                                     |
| :-------- | :------ | :-------------------------------------------------------------- |
| name      | string  | The name of the channel to create.                              |
| isPrivate | boolean | _Optional_. Whether the channel should be private. Defaults to `false`. |
| join      | boolean | _Optional_. Whether the user should join the channel. Defaults to `true`. |

## Returns

A promise that resolves to a channel object for the newly created channel.

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function createNewChannel() {
  try {
    const newChannel = await client.createChannel({
      name: 'new-exciting-project',
      isPrivate: true,
    });
    console.log(`Channel created: ${newChannel.name} (${newChannel.id})`);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts an object with the following properties:

-   `name` (string, required): The name of the channel to create.
-   `isPrivate` (boolean, optional): Whether the channel should be private. Defaults to `false`.
-   `join` (boolean, optional): Whether the bot should join the newly created channel or not. Defaults to `true`

## Response

This method returns a `channel` object containing information about the newly created channel.

### Channel Object Schema

| Property                | Type    | Description                                                        |
| ----------------------- | ------- | ------------------------------------------------------------------ |
| `id`                    | String  | The ID of the channel.                                             |
| `name`                  | String  | The name of the channel.                                           |
| `is_channel`            | Boolean | Indicates if the object represents a channel.                      |
| `is_group`              | Boolean | Indicates if the object represents a private channel.              |
| `is_im`                 | Boolean | Indicates if the object represents a direct message conversation.  |
| `created`               | Integer | A Unix timestamp indicating when the channel was created.          |
| `creator`               | String  | The ID of the user who created the channel.                        |
| `is_archived`           | Boolean | Indicates if the channel is archived.                              |
| `is_general`            | Boolean | Indicates if the channel is the default "general" channel.         |
| `unlinked`              | Integer |                                                                    |
| `name_normalized`       | String  | The channel name, but with any special characters replaced.        |
| `is_shared`             | Boolean | Indicates if the channel is shared with other workspaces.          |
| `is_ext_shared`         | Boolean | Indicates if the channel is part of an external shared connection. |
| `is_org_shared`         | Boolean | Indicates if the channel is shared with the entire organization.   |
| `pending_shared`        | Array   |                                                                    |
| `is_pending_ext_shared` | Boolean |                                                                    |
| `is_member`             | Boolean | Indicates if the calling user is a member of the channel.          |
| `is_private`            | Boolean | Indicates if the channel is private.                               |
| `is_mpim`               | Boolean | Indicates if the object represents a multi-person direct message.  |
| `topic`                 | Object  | An object containing the channel's topic information.              |
| `purpose`               | Object  | An object containing the channel's purpose information.            |
| `previous_names`        | Array   | A list of any previous names the channel had.                      |
| `num_members`           | Integer | The number of members in the channel.                              |
