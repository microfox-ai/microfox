# getConversationHistory

The `getConversationHistory` function fetches a conversation's history of messages and events.

## Parameters

| Name      | Type    | Description                                                                                                                                              |
| :-------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| channelId | string  | Conversation ID to fetch history for.                                                                                                                    |
| limit     | number  | _Optional_. The maximum number of items to return.                                                                                                       |
| latest    | string  | _Optional_. End of the time range of messages to include in results.                                                                                     |
| oldest    | string  | _Optional_. Start of the time range of messages to include in results.                                                                                   |
| inclusive | boolean | _Optional_. Include messages with latest or oldest timestamps in results.                                                                                |
| cursor    | string  | _Optional_. Paginate through collections of data by setting the cursor parameter to a `next_cursor` attribute returned by a previous request's response_metadata. |

## Returns

A promise that resolves to an array of message objects.

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function logConversationHistory() {
  try {
    const channelId = 'C1234567890'; // Replace with a real channel ID
    const history = await client.getConversationHistory({ channelId });
    if (history) {
      history.forEach(message => {
        console.log(message.text);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

logConversationHistory();
``` 