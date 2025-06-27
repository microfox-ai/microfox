## Function: `get`

Retrieves a single tweet by its ID.

**Purpose:**
Fetches a specific tweet from X.

**Parameters:**

- `id`: string - The ID of the tweet to retrieve. **Required**.
- `options`: object (optional) - Additional options.
  - `expansions`: array<string> (optional) - An array of expansions to include in the response.

**Return Value:**

- `Promise<TweetLookupResponse>` - A promise that resolves to the tweet data.
  - `data`: TweetResponse - The tweet data.
    - `id`: string - The unique identifier of the tweet.
    - `text`: string - The text content of the tweet.
    - `created_at`: string (optional) - The creation time of the tweet.
    - `author_id`: string (optional) - The ID of the author of the tweet.
    - `edit_history_tweet_ids`: array<string> (optional) - An array of previous tweet IDs.
  - `errors`: array<object> (optional) - An array of error objects if any occurred.
    - `detail`: string (optional) - A detailed description of the error.
    - `status`: number (optional) - The HTTP status code of the error.
    - `title`: string (optional) - The title of the error.
    - `type`: string (optional) - The type of the error.

**Examples:**

```typescript
// Example: Get a tweet by ID
const tweet = await x.tweets.get('1234567890');
```
