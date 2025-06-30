## Function: `collapseMessage`

Collapses a private message, removing it from the main inbox view.

**Parameters:**

- `id`: string | string[] - A comma-separated list or an array of fullnames for the messages to collapse.

**Return Type:**

- `Promise<void>`: A promise that resolves when the message(s) have been collapsed.

**Usage Example:**

```typescript
// Collapse a single message
await reddit.privateMessages.collapseMessage({ id: 't4_1c2c3c' });

// Collapse multiple messages
await reddit.privateMessages.collapseMessage({ id: ['t4_1c2c3c', 't4_1d4d5d'] });
```

**Code Example:**

```typescript
async function collapseMessages(messageIds) {
  try {
    await reddit.privateMessages.collapseMessage({ id: messageIds });
    console.log(`Successfully collapsed messages: ${messageIds.join(', ')}`);
  } catch (error) {
    console.error('Failed to collapse messages:', error);
  }
}

// Example usage:
collapseMessages(['t4_1c2c3c', 't4_1d4d5d']);
``` 