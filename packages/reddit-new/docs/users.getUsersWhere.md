## Function: `getUsersWhere`

Retrieves a list of users based on the specified category.

**Parameters:**

- `where` (string): The category of users to retrieve. Can be one of: `popular`, `new`.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.

**Return Value:**

- `Promise<Listing<User>>`: A promise that resolves to a listing of users.

**User Type:**

The `User` object has the same structure as the one from the `getMe` function in the `account` section. Please refer to the `account.getMe.md` documentation for the detailed `User` type definition.

**Usage Examples:**

```typescript
// Get a list of popular users
const popularUsers = await reddit.api.users.getUsersWhere({
  where: 'popular',
  limit: 10,
});
console.log(popularUsers);
```

```typescript
// Get a list of new users
const newUsers = await reddit.api.users.getUsersWhere({
  where: 'new',
});
console.log(newUsers);
```
