## Function: `unfriend`

Removes a user as a friend in a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit where the action is performed.
- `name` (string): The name of the user to unfriend.

**Return Value:**

- `Promise<void>`: A promise that resolves when the user has been unfriended.

**Usage Examples:**

```typescript
// Remove a user as a friend in the 'learnprogramming' subreddit
await reddit.api.users.unfriend({
  subreddit: 'learnprogramming',
  name: 'someuser',
});
console.log('User has been unfriended.');
```
