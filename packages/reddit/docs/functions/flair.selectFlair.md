## Function: `selectFlair`

Part of the `flair` section. Selects or clears a flair for the current user or a link.

**Parameters:**

- `params`: object
  - An object containing the selection details.
  - `subreddit`: string - The name of the subreddit.
  - `background_color`: string (optional) - A hex color code (e.g., `#ff0000`).
  - `css_class`: string (optional) - The CSS class for the flair.
  - `flair_template_id`: string (optional) - The ID of the flair template to select. To clear flair, omit this and provide an empty `text` field.
  - `link`: string (optional) - The fullname of a link (post) to apply the flair to.
  - `name`: string (optional) - The username of a user (can only be the current user).
  - `return_rtson`: 'all' | 'only' | 'none' (optional) - Control the return data format.
  - `text`: string (optional) - The flair text (max 64 characters).
  - `text_color`: 'light' | 'dark' (optional) - The color of the flair text.

**Return Value:**

- `Promise<void>`: A promise that resolves when the flair has been selected.

**Usage Example:**

```typescript
// Example: Select a flair for the current user
const subreddit = 'my-subreddit';
const templateId = 'some-flair-template-id';

await redditSdk.api.flair.selectFlair({
  subreddit: subreddit,
  flair_template_id: templateId,
  text: 'My Selected Flair',
});

console.log('Flair selected for the current user.');

// Example: Clear flair for a link
const linkFullname = 't3_postid';

await redditSdk.api.flair.selectFlair({
  subreddit: subreddit,
  link: linkFullname,
  text: '', // Empty text to clear
});

console.log(`Flair cleared for link ${linkFullname}.`);
``` 