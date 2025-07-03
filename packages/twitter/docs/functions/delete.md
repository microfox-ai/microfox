## Function: `delete`

Deletes a tweet by its ID.

**Purpose:**
Removes a specific tweet from X.

**Parameters:**

- `id`: string - The ID of the tweet to delete. **Required**.

**Return Value:**

- `Promise<TweetDeleteResponse>` - A promise that resolves to the deletion confirmation.
  - `data`: object - An object indicating whether the tweet was deleted.
    - `deleted`: boolean - True if the tweet was deleted, false otherwise.
  - `errors`: array<object> (optional) - An array of error objects if any occurred.
    - `detail`: string (optional) - A detailed description of the error.
    - `status`: number (optional) - The HTTP status code of the error.
    - `title`: string (optional) - The title of the error.
    - `type`: string (optional) - The type of the error.

**Examples:**

```typescript
// Example: Delete a tweet by ID
const result = await x.tweets.delete('1234567890');
```
