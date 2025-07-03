## Function: `readMessage`

Marks one or more private messages as read.

**Parameters:**

- `id`: string - A comma-separated list of message fullnames to mark as read.

**Return Type:**

- `Promise<void>`: A promise that resolves when the messages have been marked as read.

**Usage Example:**

```typescript
// Mark a single message as read
await reddit.privateMessages.readMessage({ id: 't4_1c2d3e' });

// Mark multiple messages as read
await reddit.privateMessages.readMessage({ id: 't4_1c2d3e,t4_4f5g6h' });
```

**Code Example:**

```typescript
async function markFirstUnreadAsRead() {
  try {
    const unreadListing = await reddit.privateMessages.getMessages({ where: 'unread', limit: 1 });
    if (unreadListing.data.children.length > 0) {
      const messageId = unreadListing.data.children[0].data.name;
      await reddit.privateMessages.readMessage({ id: messageId });
      console.log(`Message ${messageId} has been marked as read.`);
    } else {
      console.log("No unread messages found.");
    }
  } catch (error) {
    console.error("Failed to mark message as read:", error);
  }
}

markFirstUnreadAsRead();
```  
