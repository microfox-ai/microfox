# listChannelIdsMap

The `listChannelIdsMap` function retrieves a list of all public, private, and direct message channels in a Slack workspace and returns an array of objects, where each object contains the ID and name of a channel.

## Parameters

This function does not take any parameters.

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
    const channelMap = await client.listChannelIdsMap();
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