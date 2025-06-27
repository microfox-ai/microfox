## Function: `usernameAvailable`

Checks if a username is available.

**Parameters:**

- `user` (string): The username to check.

**Return Value:**

- `Promise<boolean>`: A promise that resolves to `true` if the username is available, and `false` otherwise.

**Usage Examples:**

```typescript
// Check if the username 'newredditor' is available
const isAvailable = await reddit.api.users.usernameAvailable({
  user: 'newredditor',
});

if (isAvailable) {
  console.log('Username is available!');
} else {
  console.log('Username is already taken.');
}
```
