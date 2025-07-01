## Function: `searchRedditNamesPost`

Searches for subreddit names based on a query.

**Parameters:**

- `query`: string - The search query for subreddit names.
- `exact`: boolean (optional) - If true, only returns exact matches for the query.
- `include_over_18`: boolean (optional) - If true, includes NSFW subreddits in the results.
- `include_unadvertisable`: boolean (optional) - If true, includes unadvertisable subreddits in the results.

**Return Type:**

- `Promise<{ names: string[] }>`: A promise that resolves to an object containing an array of subreddit names that match the query.

**Usage Example:**

```typescript
const searchResults = await reddit.subreddits.searchRedditNamesPost({ query: 'tech', exact: false });
console.log(searchResults.names);
```

**Code Example:**

```typescript
async function findSubreddits(searchTerm) {
  try {
    const { names } = await reddit.subreddits.searchRedditNamesPost({
      query: searchTerm,
      exact: false,
      include_over_18: true,
    });
    console.log(`Found ${names.length} subreddits for '${searchTerm}':`);
    names.forEach(name => console.log(`- r/${name}`));
  } catch (error) {
    console.error(`Failed to search for subreddits:`, error);
  }
}

findSubreddits('webdev');
``` 