## Function: `getMyKarma`

Part of the `account` section. Gets the karma breakdown by subreddit for the currently authenticated user.

**Parameters:**

This function does not take any parameters.

**Return Value:**

- `Promise<KarmaBreakdown[]>`: A promise that resolves to an array of karma breakdown objects.

**KarmaBreakdown Type:**

```typescript
export interface KarmaBreakdown {
  sr: string; // The name of the subreddit.
  comment_karma: number; // The karma earned from comments in this subreddit.
  post_karma: number; // The karma earned from posts in this subreddit.
}
```

**Usage Example:**

```typescript
// Example: Get karma breakdown
const karmaList = await redditSdk.api.account.getMyKarma();
karmaList.forEach(karma => {
  console.log(`Subreddit: ${karma.sr}, Comment Karma: ${karma.comment_karma}, Post Karma: ${karma.post_karma}`);
});
``` 