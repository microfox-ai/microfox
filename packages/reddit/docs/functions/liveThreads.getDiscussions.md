## Function: `getDiscussions`

Retrieves a listing of discussion threads about a specific live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.

**Return Value:**

- `Promise<Listing<Post>>`: A promise that resolves to a listing of posts about the live thread.

**Post Type:**

The `Post` object has the same structure as the one from the `getHot` function in the `listings` section. Please refer to the `listings.getHot.md` documentation for the detailed `Post` type definition.

**Usage Examples:**

```typescript
// Get discussions for a live thread
const discussions = await reddit.api.liveThreads.getDiscussions({
  threadId: 'some_thread_id',
  limit: 25,
});
console.log(discussions.data.children);
```
