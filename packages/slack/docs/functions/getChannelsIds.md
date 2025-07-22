# getChannelsIds

The `getChannelsIds` function retrieves a list of all channels in a Slack workspace and returns an array of objects containing the ID and name of each channel.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function logChannelIds() {
  try {
    // Get all channel IDs
    const allChannels = await client.getChannelsIds();
    console.log(`Found ${allChannels.channels.length} total channels`);

    // Get only public channel IDs
    const publicChannels = await client.getChannelsIds({ 
      types: ['public'] 
    });
    console.log(`Found ${publicChannels.channels.length} public channels`);
    
    // Find specific channel by name
    const targetChannel = publicChannels.channels.find(
      channel => channel.name === 'general'
    );
    if (targetChannel) {
      console.log(`General channel ID: ${targetChannel.id}`);
    }
  } catch (error) {
    console.error(error);
  }
}

logChannelIds();
```

## Arguments

This method accepts an object with the following properties:

| Name    | Type     | Description                                                                                |
| :------ | :------- | :----------------------------------------------------------------------------------------- |
| cursor  | String   | **Optional**. A cursor to the next page of results for pagination.                        |
| limit   | Integer  | **Optional**. The maximum number of channels to return. Defaults to 50, maximum is 1000. |
| types   | String[] | **Optional**. Channel types to include. Can be `'public'`, `'private'`, `'im'`. Defaults to all types. |

## Response

This method returns a `ChannelIdsResponse` object containing an array of simplified channel objects.

### ChannelIdsResponse Object Schema

| Property        | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| `ok`            | Boolean | `true` if the request was successful.                          |
| `channels`      | Array   | Array of Channel ID objects. See Channel ID Object Schema below. |
| `response_metadata` | Object | Object containing pagination information. See Response Metadata Schema below. |
| `error`         | String  | Error message if the request failed. Only present when `ok` is `false`. |

### Channel ID Object Schema

| Property | Type   | Description                           |
| :------- | :----- | :------------------------------------ |
| `id`     | String | The unique identifier for the channel. |
| `name`   | String | The name of the channel.              |

### Response Metadata Schema

| Property      | Type   | Description                                                    |
| :------------ | :----- | :------------------------------------------------------------- |
| `next_cursor` | String | Cursor for the next page of results. Empty string if no more results. | 