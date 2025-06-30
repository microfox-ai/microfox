## Function: `readAllMessages`

Part of the `privateMessages` section. Mark all private messages as read.

**Parameters:**

- `filter_types` (string, optional): A comma-separated list of items to filter by.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Mark all unread messages as read
await reddit.api.privateMessages.readAllMessages({});
console.log('All messages have been marked as read.');
```

```typescript
// 2. Mark only certain types of notifications as read
// The `filter_types` parameter is optional and its values are not strictly
// defined in the public API, but you could potentially filter.
await reddit.api.privateMessages.readAllMessages({ filter_types: 'messages' });
console.log('All messages of the specified types have been marked as read.');
```
