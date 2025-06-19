## Function: `deleteSrHeader`

Part of the `subreddits` section. Delete the header image for a subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to delete the header from.

**Return Value:**

- `Promise<void>`: A promise that resolves when the header is deleted.

**Usage Examples:**

```typescript
// Delete the header for the 'test' subreddit
await reddit.api.subreddits.deleteSrHeader({ subreddit: 'test' });
console.log('Subreddit header deleted.');
```
