## Function: `distinguish`

Distinguishes a post or comment.

**Parameters:**

- `id` (string): The fullname of the post or comment to distinguish.
- `how` ('yes' | 'no' | 'admin' | 'special'): How to distinguish the item.
- `sticky` (boolean, optional): Whether to sticky the item.

**Return Value:**

- `Promise<void>`: A promise that resolves when the item has been distinguished.

**Usage Examples:**

```typescript
// Distinguish a post as a moderator
await reddit.api.moderation.distinguish({
  id: 't3_somepostid',
  how: 'yes',
});
console.log('Post has been distinguished.');

// Distinguish a comment as an admin and sticky it
await reddit.api.moderation.distinguish({
  id: 't1_somecommentid',
  how: 'admin',
  sticky: true,
});
console.log('Comment has been distinguished and stickied.');
```
