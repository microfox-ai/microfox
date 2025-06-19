## Function: `subredditStylesheet`

Part of the `subreddits` section. Update a subreddit's stylesheet.

**Parameters:**

- `subreddit` (string): The subreddit to update the stylesheet for.
- `op` (string): The operation to perform: 'save' or 'preview'.
- `reason` (string): A reason for the stylesheet change (max 256 characters).
- `stylesheet_contents` (string): The new CSS for the stylesheet.

**Return Value:**

- `Promise<void>`: A promise that resolves when the stylesheet is updated.

**Usage Examples:**

```typescript
// Update the stylesheet for the 'test' subreddit
const newCss = 'body { color: red; }';
await reddit.api.subreddits.subredditStylesheet({
  subreddit: 'test',
  op: 'save',
  reason: 'Testing new stylesheet colors',
  stylesheet_contents: newCss,
});
console.log('Subreddit stylesheet updated.');
```
