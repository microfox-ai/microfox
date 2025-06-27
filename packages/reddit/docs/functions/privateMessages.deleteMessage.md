## Function: `deleteMessage`

Part of the `privateMessages` section. Delete a private message.

**Parameters:**

- `id` (string): A comma-separated list of thing fullnames of messages to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Delete a single private message
// The `id` is the fullname of the message.
await reddit.api.privateMessages.deleteMessage({ id: 't4_1cehp4a' });
console.log('Message deleted successfully.');
```

```typescript
// 2. Delete multiple private messages
// The `id` parameter can be a comma-separated string of message fullnames.
const messageIds = 't4_1cehp4a,t4_1cehp4b';
await reddit.api.privateMessages.deleteMessage({ id: messageIds });
console.log('Messages deleted successfully.');
```
