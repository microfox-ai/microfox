## Function: `getPrefsFriends`

Part of the `account` section. Gets the list of friends based on the user's preferences.

**Parameters:**

This function does not take any parameters.

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
// Example: Get preference-based friends list
const friendsList = await redditSdk.api.account.getPrefsFriends();
friendsList.data.children.forEach(userThing => {
  console.log(userThing.data.name);
});
``` 