## Function: `sendMessage`

Sends a message to a Slack channel.

**Purpose:**
Posts a message to a specified Slack channel.

**Parameters:**

- `message`: object<SlackMessage>
  - An object representing the message to be sent.

**Return Value:**

- `Promise<SlackMessageResponse>`: A promise that resolves to the Slack API response.

**SlackMessage Type:**

```typescript
export interface SlackMessage {
  channel: string; // Channel ID or name
  text: string; // Message text
  blocks?: Block[]; // Block Kit blocks (optional)
  attachments?: Attachment[]; // Legacy attachments (optional)
  thread_ts?: string; // Timestamp of parent message for threading (optional)
  reply_broadcast?: boolean; // Broadcast reply in thread (optional)
  // ... other optional fields
}
```

**SlackMessageResponse Type:**

```typescript
export interface SlackMessageResponse {
  ok: boolean; // Success indicator
  channel?: string; // Channel ID
  ts?: string; // Message timestamp
  message?: MessageResponse | Record<string, unknown>; // Message details
  error?: string; // Error message
  // ... other optional fields
}
```


**Examples:**

```typescript
// Example 1: Simple message
const response1 = await sdk.sendMessage({
  channel: '#general',
  text: 'Hello from Slack Web Tiny!',
});

// Example 2: Message with blocks
const response2 = await sdk.sendMessage({
  channel: '#general',
  text: 'Message with blocks',
  blocks: [
    sdk.blocks.section('Section 1'),
    sdk.blocks.divider(),
    sdk.blocks.section('Section 2'),
  ],
});

// Example 3: Reply Message in Threads
// Send a message in a thread
const threadResponse = await slackSDK.sendMessage({
  channel: 'C1234567890', // Channel ID
  text: 'Reply in thread',
  thread_ts: '1234567890.123456', // Thread timestamp
});

// Example 4: Message with buttons
const response3 = await sdk.sendMessage({
  channel: '#general',
  text: 'Message with interactive buttons',
  blocks: [
    sdk.blocks.section('Choose an action:'),
    {
      type: 'section',
      text: sdk.blocks.text('Click a button to continue'),
      accessory: sdk.blocks.button('Redirect Action', 'primary_action', {
        value: 'non-styled-button',
        url: 'https://example.com',
      }),
    },
    {
      type: 'section',
      text: sdk.blocks.text('Click a button to continue'),
      accessory: sdk.blocks.button('Primary Action', 'primary_action', {
        style: 'primary',
        value: 'primary_value',
      }),
    },
    {
      type: 'section',
      text: sdk.blocks.text('Or choose an alternative'),
      accessory: sdk.blocks.button('Danger Action', 'danger_action', {
        style: 'danger',
        confirm: true,
      }),
    },
  ],
});
```
