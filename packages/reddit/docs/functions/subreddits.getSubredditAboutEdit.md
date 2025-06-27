## Function: `getSubredditAboutEdit`

Retrieves editable details about a specific subreddit.

**Note:** This endpoint seems to retrieve only a limited set of a subreddit's editable fields. For comprehensive edits, consider using the `siteAdmin` function.

**Parameters:**

- `subreddit` (string): The name of the subreddit (e.g., 'learnprogramming').

**Return Value:**

- `Promise<SubredditEditInfo>`: A promise that resolves to an object containing some of the subreddit's editable information.

**SubredditEditInfo Type:**

```typescript
export interface SubredditEditInfo {
  created?: boolean;
  location?: string;
}
```

**Usage Example:**

```typescript
// Get editable info for the 'learnprogramming' subreddit
const editInfo = await reddit.api.subreddits.getSubredditAboutEdit({
  subreddit: 'learnprogramming',
});
console.log(editInfo);
```
