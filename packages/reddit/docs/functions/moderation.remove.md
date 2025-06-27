## Function: `remove`

Removes a post or comment.

**Parameters:**

- `id` (string): The fullname of the post or comment to remove.
- `spam` (boolean, optional): Whether to mark the removal as spam. Defaults to `false`.

**Return Value:**

- `Promise<void>`: A promise that resolves when the item has been removed.

**Usage Examples:**

```typescript
// Remove a post
await reddit.api.moderation.remove({
  id: 't3_somepostid',
});
console.log('Post has been removed.');

// Remove a comment and mark as spam
await reddit.api.moderation.remove({
  id: 't1_somecommentid',
  spam: true,
});
console.log('Comment has been removed as spam.');
```
