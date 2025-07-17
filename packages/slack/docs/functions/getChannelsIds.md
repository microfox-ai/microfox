# getChannelsIds

The `getChannelsIds` function retrieves a list of all public, private, and direct message channels in a Slack workspace and returns an array of objects, where each object contains the ID and name of a channel.

## Parameters

| Name        | Type    | Description                               |
| :---------- | :------ | :---------------------------------------- |
| cursor      | string  | _Optional_. A cursor to the next page of results. |
| limit       | number  | _Optional_. The maximum number of channels to return. Defaults to 50 |

## Returns

A promise that resolves to an array of objects, where each object has the following properties:

-   `id` (string): The unique identifier for the channel.
-   `name` (string): The name of the channel.

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function logChannelIds() {
  try {
    const channelMap = await client.getChannelsIds();
    if (channelMap) {
      channelMap.forEach(channel => {
        console.log(`Channel: ${channel.name}, ID: ${channel.id}`);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

logChannelIds();
```

## Response

This method returns an array of objects, each containing the following properties:

| Property | Type   | Description                   |
| :------- | :----- | :---------------------------- |
| `id`     | String | The unique identifier for the channel. |
| `name`   | String | The name of the channel.      |

``` 