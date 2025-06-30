## Function: `removeFriend`

Removes a user from the authenticated user's friends list.

**Parameters:**

- `username`: string - The username of the user to remove from the friends list.

**Return Type:**

- `Promise<void>`: A promise that resolves when the user has been successfully removed.

**Usage Example:**

```typescript
await reddit.account.removeFriend({ username: 'some_username' });
```

**Code Example:**

```typescript
async function unfriendUser(username) {
  try {
    await reddit.account.removeFriend({ username: username });
    console.log(`Successfully removed ${username} from friends.`);
  } catch (error) {
    console.error(`Failed to remove friend:`, error);
  }
}

unfriendUser('some_username_here');
``` 
