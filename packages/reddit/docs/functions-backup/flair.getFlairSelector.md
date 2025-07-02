## Function: `getFlairSelector`

Part of the `flair` section. Retrieves available flair choices for a user or a link submission.

**Parameters:**

- `params`: object (optional)
  - An object containing the context for which to retrieve flair choices.
  - `subreddit`: string - The name of the subreddit.
  - `is_newlink`: boolean (optional) - Indicates if this is for a new link.
  - `link`: string (optional) - The fullname of a link (post).
  - `name`: string (optional) - The username of a user.

**Return Value:**

- `Promise<any>`: A promise that resolves to the flair selector data. The response structure is not strictly defined and typically contains a list of flair `choices`.

**Usage Example:**

```typescript
// Example: Get flair choices for a user
const subreddit = 'my-subreddit';
const username = 'some-user';

const flairChoices = await redditSdk.api.flair.getFlairSelector({
  subreddit: subreddit,
  name: username,
});

console.log('Available flairs:', flairChoices.choices);
``` 