## Function: `retrieveUser`

Retrieves a user from Notion.

**Purpose:**
Fetches a user object from the Notion API based on its ID.

**Parameters:**

- `userId`: string (required). Unique identifier for the user.

**Return Value:**

- `Promise<User>`: A promise that resolves to a User object.
  - `id`: string. Unique identifier for the user.
  - `name`: string. Name of the user.
  - `avatar_url`: string | null. URL of the user's avatar.
  - `type`: "person" | "bot". Type of user.
  - `person`: object | undefined. Additional information for person type users.
    - `email`: string.
  - `bot`: object | undefined. Additional information for bot type users.

**Examples:**

```typescript
// Example: Retrieving a user
const user = await notion.retrieveUser("some-user-id");
console.log(user);
```