## Function: `friend`

Adds a user as a friend in a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit where the action is performed.
- `name` (string): The name of the user to friend.
- `note` (string, optional): A note to associate with the friend.

**Return Value:**

- `Promise<User>`: A promise that resolves to the user object of the added friend.

**User Type:**

The returned `User` object has the same structure as the one from the `getMe` function in the `account` section. Please refer to the `account.getMe.md` documentation for the detailed `User` type definition.

**Usage Examples:**

```typescript
// Add a user as a friend in the 'learnprogramming' subreddit
const friend = await reddit.api.users.friend({
  subreddit: 'learnprogramming',
  name: 'newfriend',
  note: 'A new friend!',
});
console.log(friend);
```
