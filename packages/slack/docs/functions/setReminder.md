# setReminder

The `setReminder` method sets a reminder for a user.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.setReminder('U12345678', 'Check on the build status', 'in 15 minutes');
    console.log('Reminder set: ', result.reminder.id);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `userId` (string): The ID of the user to set the reminder for.
-   `text` (string): The text of the reminder.
-   `time` (string): A string describing when the reminder should fire (e.g., "in 5 minutes", "at 10:30am", or a Unix timestamp).

## Response

This method returns an object containing the result of the API call.

### Response Schema

| Property   | Type    | Description                                                                                          |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `ok`       | Boolean | `true` if the request was successful.                                                                |
| `reminder` | Object  | An object containing the details of the created reminder. See Reminder Object Schema below.          |

### Reminder Object Schema

| Property      | Type    | Description                                                     |
| ------------- | ------- | --------------------------------------------------------------- |
| `id`          | String  | The ID of the reminder.                                         |
| `creator`     | String  | The ID of the user who created the reminder.                    |
| `user`        | String  | The ID of the user the reminder is for.                         |
| `text`        | String  | The text of the reminder.                                       |
| `recurring`   | Boolean | Whether the reminder is recurring.                              |
| `time`        | Integer | The timestamp of when the reminder will fire.                   |
| `complete_ts` | Integer | The timestamp of when the reminder was completed.               | 