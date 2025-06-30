## Function: `updateFlairTemplateOrder`

Part of the `flair` section. Updates the order of flair templates in a subreddit.

**Parameters:**

- `params`: object
  - An object containing the flair type and the new order.
  - `subreddit`: string - The name of the subreddit.
  - `flair_type`: 'USER_FLAIR' | 'LINK_FLAIR' - The type of flair templates to reorder.
  - `order`: string - A comma-separated list of all flair template IDs in the desired order.

**Return Value:**

- `Promise<void>`: A promise that resolves when the flair template order has been successfully updated.

**Usage Example:**

```typescript
// Example: Reorder user flair templates
const subreddit = 'my-subreddit';
const newOrder = 'template-id-3,template-id-1,template-id-2';

await redditSdk.api.flair.updateFlairTemplateOrder({
  subreddit: subreddit,
  flair_type: 'USER_FLAIR',
  order: newOrder,
});

console.log(`User flair templates have been reordered in r/${subreddit}.`);
``` 