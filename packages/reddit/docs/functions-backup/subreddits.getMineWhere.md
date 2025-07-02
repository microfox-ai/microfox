## Function: `getMineWhere`

Retrieves a list of subreddits related to the authenticated user, based on the specified category.

**Parameters:**

- `where` (string): The category of subreddits to retrieve. Can be one of: `contributor`, `moderator`, `streams`, `subscriber`.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.

**Return Value:**

- `Promise<Listing<Subreddit>>`: A promise that resolves to a listing of subreddits.

**Subreddit Type:**

The `Subreddit` object has the same structure as the one from the `getSubredditAbout.md` function. Please refer to the `getSubredditAbout.md` documentation for the detailed `Subreddit` type definition.

**Usage Examples:**

```typescript
// Get subreddits where the user is a moderator
const moderatedSubreddits = await reddit.api.subreddits.getMineWhere({
  where: 'moderator',
  limit: 25,
});
console.log(moderatedSubreddits);
```

```typescript
// Get subreddits the user is subscribed to
const subscribedSubreddits = await reddit.api.subreddits.getMineWhere({
  where: 'subscriber',
});
console.log(subscribedSubreddits);
```
