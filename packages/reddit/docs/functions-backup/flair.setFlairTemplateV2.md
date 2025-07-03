## Function: `setFlairTemplateV2`

Part of the `flair` section. Creates or updates a flair template using the V2 endpoint, which supports more customization.

**Parameters:**

- `params`: object
  - An object containing the flair template details.
  - `subreddit`: string - The name of the subreddit.
  - `allowable_content`: 'all' | 'emoji' | 'text' (optional) - The type of content allowed in the flair.
  - `background_color`: string (optional) - A hex color code (e.g., `#ff0000`).
  - `css_class`: string (optional) - The CSS class for the flair.
  - `flair_template_id`: string (optional) - The ID of an existing template to update.
  - `flair_type`: 'USER_FLAIR' | 'LINK_FLAIR' - The type of flair template.
  - `max_emojis`: number (optional) - The maximum number of emojis allowed (1-10).
  - `mod_only`: boolean (optional) - Whether the flair is for moderators only.
  - `override_css`: boolean (optional) - Whether to override the subreddit's CSS.
  - `text`: string (optional) - The flair text (max 64 characters).
  - `text_color`: 'light' | 'dark' (optional) - The color of the flair text.
  - `text_editable`: boolean (optional) - Whether the flair text is editable by users.

**Return Value:**

- `Promise<void>`: A promise that resolves when the flair template has been successfully created or updated.

**Usage Example:**

```typescript
// Example: Create a new link flair template with a background color
const subreddit = 'my-subreddit';

await redditSdk.api.flair.setFlairTemplateV2({
  subreddit: subreddit,
  flair_type: 'LINK_FLAIR',
  text: 'Important',
  background_color: '#ff4500',
  text_color: 'light',
  text_editable: false,
});

console.log(`V2 Flair template has been created or updated in r/${subreddit}.`);
``` 