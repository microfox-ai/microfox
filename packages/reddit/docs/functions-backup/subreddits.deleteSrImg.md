## Function: `deleteSrImg`

Part of the `subreddits` section. Delete an image from a subreddit's stylesheet.

**Parameters:**

- `subreddit` (string): The subreddit to delete the image from.
- `img_name` (string): The name of the image to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the image is deleted.

**Usage Examples:**

```typescript
// Delete the image 'test-image' from the 'test' subreddit
await reddit.api.subreddits.deleteSrImg({
  subreddit: 'test',
  img_name: 'test-image',
});
console.log('Subreddit image deleted.');
```
