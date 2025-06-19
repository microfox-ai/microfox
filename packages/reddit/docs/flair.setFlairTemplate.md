## Function: `setFlairTemplate`

Part of the `flair` section. Creates or updates a flair template.

**Parameters:**

- `params`: object
  - An object containing the flair template details.
  - `subreddit`: string - The name of the subreddit.
  - `css_class`: string (optional) - The CSS class for the flair.
  - `flair_template_id`: string (optional) - The ID of an existing template to update.
  - `flair_type`: 'USER_FLAIR' | 'LINK_FLAIR' - The type of flair template.
  - `text`: string (optional) - The flair text (max 64 characters).
  - `text_editable`: boolean (optional) - Whether the flair text is editable by users.

**Return Value:**

- `Promise<void>`: A promise that resolves when the flair template has been successfully created or updated.

**Usage Example:**

```typescript
// Example: Create a new, user-editable user flair template
const subreddit = 'my-subreddit';

await redditSdk.api.flair.setFlairTemplate({
  subreddit: subreddit,
  flair_type: 'USER_FLAIR',
  text: 'Team A',
  text_editable: true,
  css_class: 'team-a-flair',
});

console.log(`Flair template has been created or updated in r/${subreddit}.`);
``` 