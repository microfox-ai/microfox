## Function: `getModLog`

Retrieves the moderation log for a subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to retrieve the moderation log from.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.
- `mod` (string, optional): A specific moderator to filter by.
- `type` (string, optional): The type of moderation action to filter by (e.g., 'banuser', 'removelink').

**Return Value:**

- `Promise<Listing<ModAction>>`: A promise that resolves to a listing of moderation actions.

**ModAction Type:**

```typescript
export interface ModAction {
  action?: string; // The type of action performed (e.g., "removelink").
  actionedAt?: Date; // The timestamp of when the action was performed.
  subreddit?: Subreddit; // The subreddit where the action occurred.
  moderator?: User; // The moderator who performed the action.
  targetUser?: User; // The user targeted by the action.
  targetComment?: Comment; // The comment targeted by the action.
  targetPost?: Post; // The post targeted by the action.
}
```

**Note:** The `Subreddit`, `User`, `Comment`, and `Post` types are complex and are defined in other documentation files.

**Usage Examples:**

```typescript
// Get the moderation log for a subreddit
const modLog = await reddit.api.moderation.getModLog({
  subreddit: 'learnprogramming',
  limit: 25,
});
console.log(modLog.data.children);
```
