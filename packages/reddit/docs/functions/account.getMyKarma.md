## Function: `getMyKarma`

Retrieves the karma breakdown for the currently authenticated user, showing karma per subreddit.

**Return Type:**

- `Promise<KarmaBreakdown[]>`: A promise that resolves to an array of karma breakdown objects.

**KarmaBreakdown Object Details:**

- `sr`: string - The name of the subreddit.
- `comment_karma`: number - The karma earned from comments in this subreddit.
- `post_karma`: number - The karma earned from posts in this subreddit.

**Usage Example:**

```typescript
const karma = await reddit.account.getMyKarma();
console.log(karma);
```

**Code Example:**

```typescript
async function fetchKarma() {
  const karmaBreakdown = await reddit.account.getMyKarma();
  karmaBreakdown.forEach(subredditKarma => {
    console.log(`Subreddit: ${subredditKarma.sr}`);
    console.log(`  Post Karma: ${subredditKarma.post_karma}`);
    console.log(`  Comment Karma: ${subredditKarma.comment_karma}`);
  });
}

fetchKarma();
``` 
