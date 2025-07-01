## Function: `strikeUpdate`

Strikes an update from a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `id` (string): The ID of the update to strike.

**Return Value:**

- `Promise<void>`: A promise that resolves when the update has been stricken.

**Usage Examples:**

```typescript
// Strike an update from a live thread
await reddit.api.liveThreads.strikeUpdate({
  threadId: 'some_thread_id',
  id: 'some_update_id',
});
console.log('Update has been stricken.');
```
