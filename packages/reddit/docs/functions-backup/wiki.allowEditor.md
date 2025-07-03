## Function: `allowEditor`

Adds or removes a user as an editor for a specific wiki page.

**Parameters:**

- `subreddit` (string): The subreddit where the wiki page exists.
- `act` ('add' | 'del'): The action to perform. 'add' to add an editor, 'del' to remove one.
- `page` (string): The name of the wiki page.
- `username` (string): The username of the user to add or remove as an editor.

**Return Value:**

- `Promise<void>`: A promise that resolves when the action is complete.

**Usage Examples:**

```typescript
// Add a user as an editor for a wiki page
await reddit.api.wiki.allowEditor({
  subreddit: 'learnprogramming',
  act: 'add',
  page: 'index',
  username: 'new_editor',
});
console.log('Editor added.');

// Remove a user as an editor
await reddit.api.wiki.allowEditor({
  subreddit: 'learnprogramming',
  act: 'del',
  page: 'index',
  username: 'old_editor',
});
console.log('Editor removed.');
```
