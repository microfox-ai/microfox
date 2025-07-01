## Function: `deleteSrIcon`

Part of the `subreddits` section. Delete the icon image for a subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to delete the icon from.

**Return Value:**

- `Promise<void>`: A promise that resolves when the icon is deleted.

**Usage Examples:**

```typescript
// Delete the icon for the 'test' subreddit
await reddit.api.subreddits.deleteSrIcon({ subreddit: 'test' });
console.log('Subreddit icon deleted.');
```
