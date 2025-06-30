## Function: `deleteSrBanner`

Part of the `subreddits` section. Delete the banner image for a subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to delete the banner from.

**Return Value:**

- `Promise<void>`: A promise that resolves when the banner is deleted.

**Usage Examples:**

```typescript
// Delete the banner for the 'test' subreddit
await reddit.api.subreddits.deleteSrBanner({ subreddit: 'test' });
console.log('Subreddit banner deleted.');
```
