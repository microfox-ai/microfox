## Function: `readAllMessages`

Marks all private messages in the user's inbox as read.

**Parameters:**

- `filter_types`: "inbox" | "unread" | "mod" (optional) - The types of messages to mark as read. If not provided, it will mark all types.

**Return Type:**

- `Promise<void>`: A promise that resolves when all messages have been marked as read. The API returns a `202 Accepted` status code, and the SDK returns an empty string `''` on success.

**Usage Example:**

```typescript
await reddit.privateMessages.readAllMessages({ filter_types: 'inbox' });
```

**Code Example:**

```typescript
async function markAllAsRead() {
  try {
    await reddit.privateMessages.readAllMessages();
    console.log("Successfully marked all messages as read.");
  } catch (error) {
    console.error("Failed to mark all messages as read:", error);
  }
}

markAllAsRead();
``` 