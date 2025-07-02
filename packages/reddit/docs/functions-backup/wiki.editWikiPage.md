## Function: `editWikiPage`

Edits a wiki page in a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit where the wiki page exists.
- `page` (string): The name of the wiki page to edit.
- `content` (string): The new content of the wiki page in markdown format.
- `reason` (string, optional): A reason for the edit.

**Return Value:**

- `Promise<void>`: A promise that resolves when the wiki page has been edited.

**Usage Examples:**

```typescript
// Edit a wiki page
await reddit.api.wiki.editWikiPage({
  subreddit: 'learnprogramming',
  page: 'index',
  content: 'This is the new content of the wiki page.',
  reason: 'Updating information.',
});
console.log('Wiki page has been edited.');
```
