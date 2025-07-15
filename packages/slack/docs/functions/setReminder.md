# setReminder

The `setReminder` method sets a reminder for a user.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.setReminder({
      userId: 'U12345678',
      text: 'Remember to submit your report.',
      time: 'in 1 hour',
    });
    console.log('Reminder set: ', result.reminder.id);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts an object with the following properties:

-   `userId` (string, required): The ID of the user to set a reminder for.
-   `text` (string, required): The text of the reminder.
-   `time` (string, required): A string describing when the reminder should fire (e.g., "in 5 minutes", "at 10pm", or a Unix timestamp).

## Response

This method returns an object containing the result of the API call.

### Response Schema

| Property   | Type    | Description                                       |
| ---------- | ------- | ------------------------------------------------- |
| `ok`       | Boolean | `true` if the request was successful.             |
| `reminder` | Object  | An object containing details of the new reminder. | 