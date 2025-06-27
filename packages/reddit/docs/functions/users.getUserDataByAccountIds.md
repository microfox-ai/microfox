## Function: `getUserDataByAccountIds`

Retrieves user data for a list of account IDs.

**Parameters:**

- `ids` (string): A comma-separated list of account fullnames (e.g., 't2_12345,t2_67890').

**Return Value:**

- `Promise<Record<string, User>>`: A promise that resolves to an object where keys are account IDs and values are the corresponding user objects.

**User Type:**

The `User` object has the same structure as the one from the `getMe` function in the `account` section. Please refer to the `account.getMe.md` documentation for the detailed `User` type definition.

**Usage Examples:**

```typescript
// Get user data for two account IDs
const userData = await reddit.api.users.getUserDataByAccountIds({
  ids: 't2_12345,t2_67890',
});
console.log(userData);
```
