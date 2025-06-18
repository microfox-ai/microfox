## Function: `search`

Part of the `listings` section. Searches for posts.

### Parameters
- An object with the following properties:

| Name | Type | Description |
|---|---|---|
| q | string | The search query. |
| after | string | (Optional) The fullname of the item to retrieve the listing from. |
| before | string | (Optional) The fullname of the item to retrieve the listing from. |
| category | string | (Optional) The category to search in. |
| count | number | (Optional) The number of items already seen in the listing. |
| include_facets | boolean | (Optional) Whether to include facets in the results. |
| limit | number | (Optional) The maximum number of items to return. |
| restrict_sr | boolean | (Optional) Whether to restrict the search to the current subreddit. |
| show | 'all' | (Optional) Whether to show all results. |
| sort | 'relevance' \| 'hot' \| 'top' \| 'new' \| 'comments' | (Optional) The sort order for the results. |
| sr_detail | boolean | (Optional) Whether to include subreddit details. |
| t | 'hour' \| 'day' \| 'week' \| 'month' \| 'year' \| 'all' | (Optional) The time period to sort by. |
| type | string | (Optional) A comma-delimited list of result types (sr, link, user). |

### Return Value
- A `Promise` that resolves to a `ThingListing` of posts.

### Example
```javascript
// Example: Search for posts with the query "javascript"
const searchResults = await redditSdk.api.listings.search({
  q: 'javascript',
  sort: 'new',
});
console.log(searchResults);
``` 