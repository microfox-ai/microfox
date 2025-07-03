## Function: `addFriend`

Part of the `account` section. Adds a user to the authenticated user's friends list.

**Parameters:**

- `params`: object
  - An object containing the user to add and an optional note.
  - `username`: string - The username of the user to add to the friends list.
  - `note`: string (optional) - A note to associate with the friend.

**Return Value:**

- `Promise<User>`: A promise that resolves to the user object of the added friend.

**User Type:**

The returned `User` object has the same structure as the one from the `getMe` function. Please refer to the `getMe.md` documentation for the detailed `User` type definition.

**Usage Example:**

```typescript
// Example: Add a friend with a note
const friendUsername = 'new_friend_username';
const friendNote = 'This is a note about my new friend.';

const addedFriend = await redditSdk.api.account.addFriend({
  username: friendUsername,
  note: friendNote,
});

console.log(`Added ${addedFriend.name} as a friend.`);
```
