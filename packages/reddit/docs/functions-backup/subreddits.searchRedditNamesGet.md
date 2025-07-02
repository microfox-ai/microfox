## Function: `searchRedditNamesGet`

Part of the `subreddits` section. Search for subreddit names using a GET request.

**Parameters:**

- `query` (string): The search query.
- `exact` (boolean, optional): If true, find an exact match for the query.
- `include_over_18` (boolean, optional): Whether to include over-18 subreddits in the results.
- `include_unadvertisable` (boolean, optional): Whether to include unadvertisable subreddits.
- `search_query_id` (string, optional): A UUID for the search query.
- `typeahead_active` (boolean, optional): Whether typeahead is active.

**Return Value:**

- `Promise<any>`: A promise that resolves to the search results.

**Usage Examples:**

```typescript
// Search for subreddits with 'react' in the name
const results = await reddit.api.subreddits.searchRedditNamesGet({
  query: 'react',
});
console.log(results);
```
