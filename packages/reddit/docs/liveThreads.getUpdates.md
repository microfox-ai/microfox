## Function: `getUpdates`

Retrieves a listing of updates from a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.
- `is_embed` (boolean, optional): Whether this is an embedded request.
- `stylesr` (string, optional): A subreddit name.

**Return Value:**

- `Promise<Listing<LiveUpdate>>`: A promise that resolves to a listing of live update objects.

**LiveUpdate Type:**

The `LiveUpdate` object has the same structure as the one from the `getUpdate` function. Please refer to the `liveThreads.getUpdate.md` documentation for the detailed `LiveUpdate` type definition.

**Usage Examples:**

```typescript
// Get updates from a live thread
const liveUpdates = await reddit.api.liveThreads.getUpdates({
  threadId: 'some_thread_id',
  limit: 25,
});
console.log(liveUpdates.data.children);
```
