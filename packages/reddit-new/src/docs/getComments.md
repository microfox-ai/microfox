## Function: `getComments`

Part of the `listings` section. Gets the comments for a given link.

### Parameters
- An object with the following properties:

| Name | Type | Description |
|---|---|---|
| article | string | ID36 of a link. |
| comment | string | (Optional) ID36 of a comment. |
| context | number | (Optional) An integer between 0 and 8. |
| depth | number | (Optional) The maximum depth of comments to retrieve. |
| limit | number | (Optional) The maximum number of comments to retrieve. |
| showedits | boolean | (Optional) Whether to show edits. |
| showmedia | boolean | (Optional) Whether to show media. |
| showmore | boolean | (Optional) Whether to show "more" comments. |
| showtitle | boolean | (Optional) Whether to show the title. |
| sort | 'confidence' \| 'top' \| 'new' \| 'controversial' \| 'old' \| 'random' \| 'qa' \| 'live' | (Optional) The sort order for comments. |
| sr_detail | boolean | (Optional) Whether to include subreddit details. |
| theme | 'default' \| 'dark' | (Optional) The theme to use. |
| threaded | boolean | (Optional) Whether to thread comments. |
| truncate | number | (Optional) An integer between 0 and 50. |

### Return Value
- A `Promise` that resolves to a `ThingListing` of comments.

### Example
```javascript
// Example: Get comments for a post
const comments = await redditSdk.api.listings.getComments({
  article: 'q4z1q',
  sort: 'new',
});
console.log(comments);
``` 