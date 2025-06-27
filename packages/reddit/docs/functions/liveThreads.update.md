## Function: `update`

Posts an update to a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `body` (string): The markdown-formatted text of the update.

**Return Value:**

- `Promise<void>`: A promise that resolves when the update has been posted.

**Usage Examples:**

```typescript
// Post an update to a live thread
await reddit.api.liveThreads.update({
  threadId: 'some_thread_id',
  body: 'This is a new update!',
});
console.log('Update has been posted.');
```
