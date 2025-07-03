## Function: `unreadMessage`

Part of the `privateMessages` section. Mark a private message as unread.

**Parameters:**

- `id` (string): A comma-separated list of thing fullnames of messages to mark as unread.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Mark a single message as unread by its fullname
await reddit.api.privateMessages.unreadMessage({ id: 't4_1cehp4a' });
console.log('Message has been marked as unread.');
```

```typescript
// 2. Mark multiple messages as unread in one request
const messageIds = 't4_1cehp4a,t4_1cehp4b,t4_1cehp4c';
await reddit.api.privateMessages.unreadMessage({ id: messageIds });
console.log('Specified messages have been marked as unread.');
```
