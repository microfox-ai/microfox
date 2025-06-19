## Function: `uncollapseMessage`

Part of the `privateMessages` section. Uncollapse a private message.

**Parameters:**

- `id` (string): A comma-separated list of thing fullnames of messages to uncollapse.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Uncollapse a single private message
// The `id` is the fullname of the message.
await reddit.api.privateMessages.uncollapseMessage({ id: 't4_1cehp4a' });
console.log('Message uncollapsed successfully.');
```

```typescript
// 2. Uncollapse multiple private messages
// Provide a comma-separated string of message fullnames.
const messageIds = 't4_1cehp4a,t4_1cehp4b,t4_1cehp4c';
await reddit.api.privateMessages.uncollapseMessage({ id: messageIds });
console.log('Multiple messages uncollapsed successfully.');
```
