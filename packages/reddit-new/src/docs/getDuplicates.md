## Function: `getDuplicates`

Part of the `listings` section. Gets a listing of posts that are duplicates of the specified post.

### Parameters
- An object with the following properties:

| Name | Type | Description |
|---|---|---|
| article | string | The base 36 ID of a Link. |
| crossposts_only | boolean | (Optional) Whether to only include crossposts. |
| sort | 'num_comments' \| 'new' | (Optional) The sort order for the listing. |
| sr | string | (Optional) The subreddit name. |
| after | string | (Optional) The fullname of the item to retrieve the listing from. |
| before | string | (Optional) The fullname of the item to retrieve the listing from. |
| limit | number | (Optional) The maximum number of items to return. |
| sr_detail | boolean | (Optional) Include additional details for subreddits. |

### Return Value
- A `Promise` that resolves to a `ThingListing` of posts.

### Example
```javascript
// Example: Get duplicates of a post
const duplicates = await redditSdk.api.listings.getDuplicates({
  article: 't3_q4z1q',
});
console.log(duplicates);
``` 