## Function: `unreadMessage`

Marks one or more private messages as unread.

**Parameters:**

- `id`: string | string[] - A comma-separated list or an array of fullnames for the messages to mark as unread.

**Return Type:**

- `Promise<void>`: A promise that resolves when the messages have been marked as unread.

**Usage Example:**

```typescript
// Mark a single message as unread
await reddit.privateMessages.unreadMessage({ id: 't4_1c2d3e' });

// Mark multiple messages as unread using a comma-separated string
await reddit.privateMessages.unreadMessage({ id: 't4_1c2d3e,t4_4f5g6h' });

// Mark multiple messages as unread using an array of strings
await reddit.privateMessages.unreadMessage({ id: ['t4_1c2d3e', 't4_4f5g6h'] });
```

**Code Example:**

```typescript
async function markLatestMessageUnread() {
  try {
    const sentListing = await reddit.privateMessages.getMessages({ where: 'sent', limit: 1 });
    if (sentListing.data.children.length > 0) {
      const messageId = sentListing.data.children[0].data.name;
      await reddit.privateMessages.unreadMessage({ id: messageId });
      console.log(`Message ${messageId} has been marked as unread.`);
    } else {
      console.log("No sent messages found.");
    }
  } catch (error) {
    console.error("Failed to mark message as unread:", error);
  }
}

markLatestMessageUnread();
``` 