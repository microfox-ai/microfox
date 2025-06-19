## Function: `getUserTrophies`

Retrieves the trophy case for a specific user.

**Parameters:**

- `username` (string): The username of the user to retrieve trophies for.

**Return Value:**

- `Promise<TrophyList>`: A promise that resolves to a list of the user's trophies.

**TrophyList Type:**

The `TrophyList` object has the same structure as the one from the `getMyTrophies` function in the `account` section. Please refer to the `account.getMyTrophies.md` documentation for the detailed `TrophyList` type definition.

**Usage Example:**

```typescript
// Get trophies for a specific user
const trophyList = await reddit.api.users.getUserTrophies({
  username: 'someuser',
});
trophyList.data.trophies.forEach(trophyContainer => {
  console.log(trophyContainer.data.name);
});
```
