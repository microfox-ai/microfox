## Function: `ignoreReports`

Ignores reports on a post or comment.

**Parameters:**

- `id` (string): The fullname of the post or comment to ignore reports on.

**Return Value:**

- `Promise<void>`: A promise that resolves when the reports have been ignored.

**Usage Examples:**

```typescript
// Ignore reports on a post
await reddit.api.moderation.ignoreReports({
  id: 't3_somepostid',
});
console.log('Reports on the post have been ignored.');

// Ignore reports on a comment
await reddit.api.moderation.ignoreReports({
  id: 't1_somecommentid',
});
console.log('Reports on the comment have been ignored.');
```
