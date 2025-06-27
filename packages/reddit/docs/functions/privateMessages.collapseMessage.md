## Function: `collapseMessage`

Part of the `privateMessages` section. Collapse a message.

**Parameters:**

- `id` (string): A comma-separated list of thing fullnames.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Collapse a single private message
// The `id` is the fullname of the message.
await reddit.api.privateMessages.collapseMessage({ id: 't4_1cehp4a' });
console.log('Message collapsed successfully.');
```

```typescript
// 2. Collapse multiple private messages
// Provide a comma-separated string of message fullnames.
const messageIds = 't4_1cehp4a,t4_1cehp4b,t4_1cehp4c';
await reddit.api.privateMessages.collapseMessage({ id: messageIds });
console.log('Multiple messages collapsed successfully.');
```
