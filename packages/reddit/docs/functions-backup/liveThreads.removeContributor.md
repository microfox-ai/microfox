## Function: `removeContributor`

Removes a contributor from a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `id` (string): The fullname of the account to remove.

**Return Value:**

- `Promise<void>`: A promise that resolves when the contributor has been removed.

**Usage Examples:**

```typescript
// Remove a contributor from a live thread
await reddit.api.liveThreads.removeContributor({
  threadId: 'some_thread_id',
  id: 't2_someuser',
});
console.log('Contributor has been removed.');
```
