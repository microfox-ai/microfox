## Function: `inviteContributor`

Invites a user to be a contributor on a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `name` (string): The username of the user to invite.
- `permissions` (string): A string describing the permissions to grant the user (e.g., `+update,+edit,-manage`).
- `type` ('liveupdate_contributor_invite' | 'liveupdate_contributor'): The type of contributor.

**Return Value:**

- `Promise<void>`: A promise that resolves when the user has been invited.

**Usage Examples:**

```typescript
// Invite a contributor to a live thread
await reddit.api.liveThreads.inviteContributor({
  threadId: 'some_thread_id',
  name: 'someuser',
  permissions: '+update',
  type: 'liveupdate_contributor_invite',
});
console.log('Contributor has been invited.');
```
