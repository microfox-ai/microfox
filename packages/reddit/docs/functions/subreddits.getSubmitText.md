## Function: `getSubmitText`

Part of the `subreddits` section. Get the submission text for a subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to get the submission text from.

**Return Value:**

- `Promise<any>`: A promise that resolves to the submission text data.

**Usage Examples:**

```typescript
// Get the submission text for the 'learnprogramming' subreddit
const submitText = await reddit.api.subreddits.getSubmitText({
  subreddit: 'learnprogramming',
});
console.log(submitText);
```
