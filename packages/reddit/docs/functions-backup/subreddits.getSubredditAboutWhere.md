## Function: `getSubredditAboutWhere`

Part of the `subreddits` section. Get various user listings for a subreddit.

**Parameters:**

- `subreddit` (string): The name of the subreddit.
- `where` (string): The user list to retrieve. Can be one of: `banned`, `muted`, `wikibanned`, `contributors`, `wikicontributors`, `moderators`.
- `user` (string, optional): A specific user to filter by in the listing.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `before` (string, optional): Return items before this fullname.
- `after` (string, optional): Return items after this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.

**Return Value:**

- `Promise<any>`: A promise that resolves to the requested listing.

**Usage Examples:**

```typescript
// Get the list of moderators for 'learnprogramming'
const moderators = await reddit.api.subreddits.getSubredditAboutWhere({
  subreddit: 'learnprogramming',
  where: 'moderators',
});
console.log(moderators);
```

```typescript
// Get the list of banned users for 'learnprogramming'
const bannedUsers = await reddit.api.subreddits.getSubredditAboutWhere({
  subreddit: 'learnprogramming',
  where: 'banned',
  limit: 10,
});
console.log(bannedUsers);
```
