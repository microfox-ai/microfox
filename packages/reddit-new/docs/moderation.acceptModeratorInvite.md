## Function: `acceptModeratorInvite`

Accepts an invitation to become a moderator of a subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to become a moderator of.

**Return Value:**

- `Promise<void>`: A promise that resolves when the invitation has been accepted.

**Usage Examples:**

```typescript
// Accept a moderator invitation for a subreddit
await reddit.api.moderation.acceptModeratorInvite({
  subreddit: 'learnprogramming',
});
console.log('Moderator invitation accepted.');
```
