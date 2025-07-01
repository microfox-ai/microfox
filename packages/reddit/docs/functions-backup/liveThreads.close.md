## Function: `close`

Closes a live thread, preventing any new updates.

**Parameters:**

- `threadId` (string): The ID of the live thread to close.

**Return Value:**

- `Promise<void>`: A promise that resolves when the thread has been closed.

**Usage Examples:**

```typescript
// Close a live thread
await reddit.api.liveThreads.close({
  threadId: 'some_thread_id',
});
console.log('Live thread has been closed.');
```
