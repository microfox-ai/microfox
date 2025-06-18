## Function: `getRising`

Part of the `listings` section. Gets the \"rising\" listing of posts.

### Parameters
- An object with the following optional properties:

| Name | Type | Description |
|---|---|---|
| after | string | The fullname of the item to retrieve the listing from. |
| before | string | The fullname of the item to retrieve the listing from. |
| limit | number | The maximum number of items to return. |
| sr_detail | boolean | Include additional details for subreddits. |

### Return Value
- A `Promise` that resolves to a `ThingListing` of posts.

### Example
```javascript
// Example: Get the rising posts
const risingPosts = await redditSdk.api.listings.getRising({ limit: 25 });
console.log(risingPosts);
```
