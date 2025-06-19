## Function: `leaveContributor`

Abandons contributor status on a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.

**Return Value:**

- `Promise<void>`: A promise that resolves when the user has left as a contributor.

**Usage Examples:**

```typescript
// Leave as a contributor from a live thread
await reddit.api.liveThreads.leaveContributor({
  threadId: 'some_thread_id',
});
console.log('Successfully left as a contributor.');
```
