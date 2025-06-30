## Function: `searchSubreddits`

Searches for subreddits by a query string. This endpoint is different from `searchSubredditsListing` and `searchRedditNamesPost` and provides a different response structure.

**Parameters:**

- `query`: string - The search query for subreddits.

**Return Type:**

- `Promise<{ subreddits: SubredditInfo[] }>`: A promise that resolves to an object containing an array of `SubredditInfo` objects.

**SubredditInfo Object Details:**

- `name`: string - The name of the subreddit.
- `num_subscribers`: number - The number of subscribers.
- `id`: string - The unique ID of the subreddit.
- `created_utc`: number - The UTC timestamp of when the subreddit was created.
- `allow_images`: boolean - Whether the subreddit allows image posts.

**Usage Example:**

```typescript
const searchResults = await reddit.subreddits.searchSubreddits({ query: 'history' });
console.log(searchResults.subreddits);
```

**Code Example:**

```typescript
async function searchForSubreddits(query) {
  try {
    const { subreddits } = await reddit.subreddits.searchSubreddits({ query: query });
    console.log(`Found ${subreddits.length} subreddits for query "${query}":`);
    subreddits.forEach(sr => {
      console.log(`- r/${sr.name} (${sr.num_subscribers} subscribers)`);
    });
  } catch (error) {
    console.error(`Failed to search for subreddits:`, error);
  }
}

searchForSubreddits('science');
``` 