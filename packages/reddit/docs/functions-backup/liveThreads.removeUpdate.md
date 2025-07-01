## Function: `removeUpdate`

Removes an update from a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `id` (string): The ID of the update to remove.

**Return Value:**

- `Promise<void>`: A promise that resolves when the update has been removed.

**Usage Examples:**

```typescript
// Remove an update from a live thread
await reddit.api.liveThreads.removeUpdate({
  threadId: 'some_thread_id',
  id: 'some_update_id',
});
console.log('Update has been removed.');
```
