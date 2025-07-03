## Function: `getLinkFlair`

Part of the `flair` section. Retrieves the link flair templates for the subreddit.

**Parameters:**

- `params`: object
  - `subreddit`: string - The name of the subreddit.

**Return Value:**

- `Promise<any>`: A promise that resolves to the list of link flair templates. The exact structure is not strictly defined by the schema.

**Usage Example:**

```typescript
// Example: Get link flair templates for a subreddit
const subreddit = 'my-subreddit';

const linkFlairs = await redditSdk.api.flair.getLinkFlair({
  subreddit: subreddit,
});

console.log('Link flairs:', linkFlairs);
``` 