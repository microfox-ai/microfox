## Function: `getPostRequirements`

Retrieves the post requirements for a specific subreddit. This includes details like the body restriction policy.

**Parameters:**

- `subreddit` (string): The name of the subreddit (e.g., 'learnprogramming').

**Return Value:**

- `Promise<SubredditPostRequirements>`: A promise that resolves to the subreddit's post requirements.

**SubredditPostRequirements Type:**

```typescript
export interface SubredditPostRequirements {
  bodyRestrictionPolicy?: string; // The restriction policy for post bodies.
}
```

**Usage Example:**

```typescript
// Get post requirements for the 'learnprogramming' subreddit
const requirements = await reddit.api.subreddits.getPostRequirements({
  subreddit: 'learnprogramming',
});
console.log(requirements);
```
