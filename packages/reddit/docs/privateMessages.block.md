## Function: `block`

Part of the `privateMessages` section. Block a user via a private message.

**Parameters:**

- `id` (string): Fullname of a thing.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Block the author of a private message
// The `id` should be the fullname of the message (e.g., 't4_1cehp4a').
await reddit.api.privateMessages.block({ id: 't4_1cehp4a' });
console.log('The sender of the message has been blocked.');
```

```typescript
// 2. Blocking a user based on a message ID from a variable
// You would typically get the message ID from a list of messages.
const messageId = 't4_someotherid';
await reddit.api.privateMessages.block({ id: messageId });
console.log(`User associated with message ${messageId} is now blocked.`);
```
