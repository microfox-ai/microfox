## Function: `searchSubredditsListing`

Searches for subreddits.

**Parameters:**

- `q` (string): The search query.
- `search_query_id` (string, optional): A UUID for the search query.
- `show_users` (boolean, optional): Whether to show users in the results.
- `sort` (string, optional): The sort order for the results. Can be 'relevance' or 'activity'.
- `typeahead_active` (boolean, optional): Whether typeahead is active.
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
// Search for subreddits related to "gaming"
const gamingSubreddits = await reddit.api.subreddits.searchSubredditsListing({
  q: 'gaming',
  sort: 'relevance',
});
console.log(gamingSubreddits);
```
