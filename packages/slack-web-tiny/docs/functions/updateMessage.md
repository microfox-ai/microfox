## Function: `updateMessage`

Updates an existing message in a Slack channel.

**Purpose:**
Modifies the content of a previously sent message.

**Parameters:**

- `message`: object<UpdateMessage>
  - An object containing the updated message data.

**Return Value:**

- `Promise<SlackMessageResponse>`: A promise that resolves to the Slack API response.

**UpdateMessage Type:**

```typescript
export interface UpdateMessage {
  channel: string; // Channel ID
  ts: string; // Message timestamp
  text?: string; // New message text (optional)
  blocks?: Block[]; // Updated blocks (optional)
  attachments?: Attachment[]; // Updated attachments (optional)
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
// Example: Updating message text
const updateResponse = await sdk.updateMessage({
  channel: '#general',
  ts: '1678886400.000000', // Replace with actual timestamp
  text: 'Updated message text',
});
```
