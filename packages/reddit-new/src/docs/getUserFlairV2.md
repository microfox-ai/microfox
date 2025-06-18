## Function: `getUserFlairV2`

Part of the `flair` section. Retrieves the user flair templates for the subreddit using the V2 endpoint.

**Parameters:**

- `params`: object
  - `subreddit`: string - The name of the subreddit.

**Return Value:**

- `Promise<any>`: A promise that resolves to the list of user flair templates. The exact structure is not strictly defined by the schema.

**Usage Example:**

```typescript
// Example: Get V2 user flair templates for a subreddit
const subreddit = 'my-subreddit';

const userFlairsV2 = await redditSdk.api.flair.getUserFlairV2({
  subreddit: subreddit,
});

console.log('V2 User flairs:', userFlairsV2);
``` 