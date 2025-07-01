## Function: `searchUsers`

Searches for users.

**Parameters:**

- `q` (string): The search query.
- `search_query_id` (string, optional): A UUID for the search query.
- `sort` (string, optional): The sort order for the results. Can be 'relevance' or 'activity'.
- `typeahead_active` (boolean, optional): Whether typeahead is active.
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
// Search for users with "john" in their name
const users = await reddit.api.users.searchUsers({
  q: 'john',
  sort: 'relevance',
});
console.log(users);
```
