## Function: `getUserAbout`

Retrieves information about a specific user.

**Parameters:**

- `username` (string): The username of the user to retrieve information about.

**Return Value:**

- `Promise<User>`: A promise that resolves to the user object.

**User Type:**

The `User` object has the same structure as the one from the `getMe` function in the `account` section. Please refer to the `account.getMe.md` documentation for the detailed `User` type definition.

**Usage Examples:**

```typescript
// Get information about a specific user
const userInfo = await reddit.api.users.getUserAbout({
  username: 'someuser',
});
console.log(userInfo);
```
