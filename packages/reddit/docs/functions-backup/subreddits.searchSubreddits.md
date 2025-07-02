## Function: `searchSubreddits`

Part of the `subreddits` section. Search for subreddits by name.

**Parameters:**

- `query` (string): The search query.
- `exact` (boolean, optional): If true, find an exact match for the query.
- `include_over_18` (boolean, optional): Whether to include over-18 subreddits in the results.
- `include_unadvertisable` (boolean, optional): Whether to include unadvertisable subreddits.
- `search_query_id` (string, optional): A UUID for the search query.
- `typeahead_active` (boolean, optional): Whether typeahead is active.

**Return Value:**

A promise that resolves to the search results. The response is an object containing a list of subreddit names that match the query.

```typescript
{
  names: string[]; // An array of subreddit names
}
```

**Usage Examples:**

```typescript
// Search for subreddits with 'react' in the name
const results = await reddit.api.subreddits.searchSubreddits({
  query: 'react',
});
console.log(results);
```
