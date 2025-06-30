## Function: `hideWikiPage`

Hides a wiki page in a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit where the wiki page exists.
- `page` (string): The name of the wiki page to hide.
- `revision` (string, optional): A specific revision of the page to hide.

**Return Value:**

- `Promise<void>`: A promise that resolves when the wiki page has been hidden.

**Usage Examples:**

```typescript
// Hide a wiki page
await reddit.api.wiki.hideWikiPage({
  subreddit: 'learnprogramming',
  page: 'index',
});
console.log('Wiki page has been hidden.');
```
