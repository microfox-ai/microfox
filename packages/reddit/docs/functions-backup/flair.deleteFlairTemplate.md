## Function: `deleteFlairTemplate`

Part of the `flair` section. Deletes a flair template in a subreddit.

**Parameters:**

- `params`: object
  - An object containing the flair template ID.
  - `subreddit`: string - The name of the subreddit.
  - `flair_template_id`: string - The ID of the flair template to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the flair template has been successfully deleted.

**Usage Example:**

```typescript
// Example: Delete a flair template
const subreddit = 'my-subreddit';
const templateId = 'some-flair-template-id';

await redditSdk.api.flair.deleteFlairTemplate({
  subreddit: subreddit,
  flair_template_id: templateId,
});

console.log(`Flair template ${templateId} has been deleted in r/${subreddit}.`);
``` 