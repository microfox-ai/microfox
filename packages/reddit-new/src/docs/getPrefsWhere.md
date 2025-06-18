## Function: `getPrefsWhere`

Part of the `account` section. Gets a list of users based on a specified preference category.

**Parameters:**

This function does not take any parameters. The "where" is part of the URL path and not a parameter to the function in the SDK.

**Return Value:**

- `Promise<UserListing>`: A promise that resolves to a listing of user objects.

**UserListing Type:**

```typescript
export interface UserListing {
  kind: "Listing";
  data: {
    after: string | null;
    before: string | null;
    dist: number | null;
    modhash: string;
    geo_filter: string | null;
    children: UserThing[];
  };
}
```

**UserThing Type:**

```typescript
export interface UserThing {
  kind: "t2";
  data: User;
}
```

**User Type:**

The `User` object has the same structure as the one from the `getMe` function. Please refer to the `getMe.md` documentation for the detailed `User` type definition.

**Usage Example:**

```typescript
// Example: Get preference-based "where" list
// The specific 'where' (e.g., 'blocked', 'friends') is determined by which function is called.
const whereList = await redditSdk.api.account.getPrefsWhere(); // This is a generic example
whereList.data.children.forEach(userThing => {
  console.log(userThing.data.name);
});
``` 