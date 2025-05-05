## Function: `listUsers`

Lists all users in the workspace.

**Purpose:**
Retrieves a list of all users accessible to the API key.

**Parameters:**
None

**Return Value:**

- `Promise<User[]>`: A promise that resolves to an array of User objects.
  - `User`: object. See `retrieveUser` for the User object structure.

**Examples:**

```typescript
// Example: Listing users
const users = await notion.listUsers();
console.log(users);
```