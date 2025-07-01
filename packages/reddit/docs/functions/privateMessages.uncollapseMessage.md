## Function: `uncollapseMessage`

Uncollapses a private message, returning it to the main inbox view.

**Parameters:**

- `id`: string | string[] - A comma-separated list or an array of fullnames for the messages to uncollapse.

**Return Type:**

- `Promise<void>`: A promise that resolves when the message(s) have been uncollapsed.

**Usage Example:**

```typescript
// Uncollapse a single message
await reddit.privateMessages.uncollapseMessage({ id: 't4_1c2c3c' });

// Uncollapse multiple messages
await reddit.privateMessages.uncollapseMessage({ id: ['t4_1c2c3c', 't4_1d4d5d'] });
```

**Code Example:**

```typescript
async function uncollapseMessages(messageIds) {
  try {
    await reddit.privateMessages.uncollapseMessage({ id: messageIds });
    console.log(`Successfully uncollapsed messages: ${messageIds.join(', ')}`);
  } catch (error) {
    console.error('Failed to uncollapse messages:', error);
  }
}

// Example usage:
uncollapseMessages(['t4_1c2c3c', 't4_1d4d5d']);
``` 