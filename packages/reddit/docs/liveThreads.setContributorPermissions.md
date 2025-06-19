## Function: `setContributorPermissions`

Sets the permissions for a contributor on a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `name` (string): The username of the contributor.
- `permissions` (string): A string describing the permissions to set (e.g., `+update,+edit,-manage`).
- `type` ('liveupdate_contributor_invite' | 'liveupdate_contributor'): The type of contributor.

**Return Value:**

- `Promise<void>`: A promise that resolves when the permissions have been set.

**Usage Examples:**

```typescript
// Set permissions for a contributor on a live thread
await reddit.api.liveThreads.setContributorPermissions({
  threadId: 'some_thread_id',
  name: 'someuser',
  permissions: '+update,+edit',
  type: 'liveupdate_contributor',
});
console.log('Contributor permissions have been set.');
```
