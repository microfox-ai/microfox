## Function: `blockUser`

Blocks a user.

**Parameters:**

- `account_id` (string): The account ID of the user to block.
- `name` (string): The name of the user to block.

**Return Value:**

- `Promise<void>`: A promise that resolves when the user is blocked.

**Usage Examples:**

```typescript
// Block a user with a specific account ID and name
await reddit.api.users.blockUser({
  account_id: 't2_12345',
  name: 'someuser',
});
console.log('User has been blocked.');
```
