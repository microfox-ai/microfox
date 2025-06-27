## Function: `getByUsername`

Retrieves a single user by their username.

**Purpose:**
Fetches a specific user from X using their username.

**Parameters:**

- `username`: string - The username of the user to retrieve. **Required**.
- `options`: object (optional) - Additional options.
  - `expansions`: array<string> (optional) - An array of expansions to include in the response.

**Return Value:**

- `Promise<UserLookupResponse>` - A promise that resolves to the user data.
  - `data`: User - The user data if found.
    - `id`: string - The unique identifier of the user.
    - `name`: string - The name of the user.
    - `username`: string - The username of the user.
    - `created_at`: string (optional) - The creation time of the user's account.
    - `protected`: boolean (optional) - Whether the user's tweets are protected.
    - `profile_image_url`: string (optional) - The URL of the user's profile image.
    - `description`: string (optional) - The user's bio.
    - `location`: string (optional) - The user's location.
    - `url`: string (optional) - The user's profile URL.
    - `verified`: boolean (optional) - Whether the user is verified.
    - `verified_type`: string (optional) - The type of verification the user has.
    - `public_metrics`: object (optional) - Public metrics for the user.
      - `followers_count`: number (optional) - The number of followers the user has.
      - `following_count`: number (optional) - The number of users the user is following.
      - `tweet_count`: number (optional) - The number of tweets the user has posted.
      - `listed_count`: number (optional) - The number of lists the user is included in.
  - `errors`: array<object> (optional) - An array of error objects if any occurred.
    - `detail`: string (optional) - A detailed description of the error.
    - `status`: number (optional) - The HTTP status code of the error.
    - `title`: string (optional) - The title of the error.
    - `type`: string (optional) - The type of the error.

**Examples:**

```typescript
// Example: Get a user by username
const user = await x.users.getByUsername('elonmusk');
```
