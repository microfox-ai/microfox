## Function: `getSorted`

Part of the `listings` section. Gets a sorted listing of posts.

### Parameters
- An object with the following optional properties:

| Name | Type | Description |
|---|---|---|
| after | string | The fullname of the item to retrieve the listing from. |
| before | string | The fullname of the item to retrieve the listing from. |
| limit | number | The maximum number of items to return. |
| sr_detail | boolean | Include additional details for subreddits. |
| t | 'hour' \| 'day' \| 'week' \| 'month' \| 'year' \| 'all' | The time period to sort by. |

### Return Value
- A `Promise` that resolves to a `ThingListing` of posts.

### Example
```javascript
// Example: Get the top posts from the last week
const sortedPosts = await redditSdk.api.listings.getSorted({ t: 'week' });
console.log(sortedPosts);
``` 