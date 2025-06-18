## Function: `getModListing`

Retrieves a moderation listing for a subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to retrieve the listing from.
- `location` ('edited' | 'modqueue' | 'reports' | 'spam' | 'unmoderated'): The moderation queue to retrieve.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.
- `only` ('links' | 'comments', optional): Filter by 'links' or 'comments'.

**Return Value:**

- `Promise<Listing<Post | Comment>>`: A promise that resolves to a listing of posts or comments.

**Note:** The `Post` and `Comment` types are complex and are defined in other documentation files.

**Usage Examples:**

```typescript
// Get the modqueue for a subreddit
const modqueue = await reddit.api.moderation.getModListing({
  subreddit: 'learnprogramming',
  location: 'modqueue',
  limit: 25,
});
console.log(modqueue.data.children);
```
