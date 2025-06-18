## Function: `removeFriend`

Part of the `account` section. Removes a user from the authenticated user's friends list.

**Parameters:**

- `params`: object
  - An object containing the user to remove.
  - `username`: string - The username of the user to remove from the friends list.

**Return Value:**

- `Promise<void>`: A promise that resolves when the friend has been successfully removed.

**Usage Example:**

```typescript
// Example: Remove a friend
const usernameToRemove = 'some_username';
await redditSdk.api.account.removeFriend({ username: usernameToRemove });
console.log(`${usernameToRemove} has been removed from your friends list.`);
``` 