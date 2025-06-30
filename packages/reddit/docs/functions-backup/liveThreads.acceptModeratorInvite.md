## Function: `acceptModeratorInvite`

Accepts an invitation to become a moderator of a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.

**Return Value:**

- `Promise<void>`: A promise that resolves when the invitation has been accepted.

**Usage Examples:**

```typescript
// Accept a moderator invitation for a live thread
await reddit.api.liveThreads.acceptModeratorInvite({
  threadId: 'some_thread_id',
});
console.log('Moderator invitation accepted.');
```
