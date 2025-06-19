## Function: `unblockSubreddit`

Part of the `privateMessages` section. Unblock a subreddit.

**Parameters:**

- `id` (string): Fullname of a thing.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Unblock a subreddit using its fullname
// This allows the subreddit's moderators to message you again.
// The `id` is the subreddit's fullname, which starts with 't5_'.
await reddit.api.privateMessages.unblockSubreddit({ id: 't5_2qh1i' }); // t5_2qh1i is r/pics
console.log('Subreddit r/pics has been unblocked.');
```

```typescript
// 2. Unblocking another subreddit from a variable
const subredditIdToUnblock = 't5_2qizd'; // r/gaming
await reddit.api.privateMessages.unblockSubreddit({ id: subredditIdToUnblock });
console.log(`Subreddit with ID ${subredditIdToUnblock} has been unblocked.`);
```
