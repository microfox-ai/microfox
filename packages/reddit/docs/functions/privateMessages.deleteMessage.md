## Function: `deleteMessage`

Deletes a private message.

**Parameters:**

- `id`: string - The fullname of the message to delete. Note: Unlike other message management functions, this endpoint appears to only support a single ID at a time.

**Return Type:**

- `Promise<void>`: A promise that resolves when the message has been deleted.

**Usage Example:**

```typescript
await reddit.privateMessages.deleteMessage({ id: 't4_1c2d3e' });
```

**Code Example:**

```typescript
async function deleteLatestSentMessage() {
  try {
    const sentListing = await reddit.privateMessages.getMessages({ where: 'sent', limit: 1 });
    if (sentListing.data.children.length > 0) {
      const messageId = sentListing.data.children[0].data.name;
      await reddit.privateMessages.deleteMessage({ id: messageId });
      console.log(`Message ${messageId} has been deleted.`);
    } else {
      console.log("No sent messages found to delete.");
    }
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
}

deleteLatestSentMessage();
```  
