## Function: `readMessage`

Part of the `privateMessages` section. Mark a private message as read.

**Parameters:**

- `id` (string): A comma-separated list of thing fullnames of messages to mark as read.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Mark a single message as read by its fullname
await reddit.api.privateMessages.readMessage({ id: 't4_1cehp4a' });
console.log('Message has been marked as read.');
```

```typescript
// 2. Mark multiple messages as read in one request
const messageIds = 't4_1cehp4a,t4_1cehp4b,t4_1cehp4c';
await reddit.api.privateMessages.readMessage({ id: messageIds });
console.log('Specified messages have been marked as read.');
```
