## Function: `getCurrentUser`

Retrieves the details of the user associated with the provided API token.

**Purpose:**
This function is used to verify the API token and fetch the profile information of the authenticated user.

**Parameters:**
This function does not take any parameters.

**Return Value:**
- `Promise<User>`: A promise that resolves to a `User` object containing the user's details.
- `User` (object):
  - `id` (string): Unique identifier of the user.
  - `username` (string): Username of the user.
  - `email` (string): Email of the user.

**Examples:**

```typescript
// Example 1: Get the current user's details
const user = await apify.getCurrentUser();
console.log(user);
// Expected output:
// {
//   id: '<user_id>',
//   username: '<username>',
//   email: '<user_email>'
// }
```