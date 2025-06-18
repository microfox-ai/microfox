## Function: `getMyTrophies`

Part of the `account` section. Gets the trophy case for the currently authenticated user.

**Parameters:**

This function does not take any parameters.

**Return Value:**

- `Promise<TrophyList>`: A promise that resolves to a list of the user's trophies.

**TrophyList Type:**

```typescript
export interface TrophyList {
  kind: "TrophyList";
  data: {
    trophies: TrophyContainer[];
  };
}
```

**TrophyContainer Type:**

```typescript
export interface TrophyContainer {
  kind: "t6";
  data: Trophy;
}
```

**Trophy Type:**

```typescript
export interface Trophy {
  id: string | null; // The ID of the trophy.
  name: string; // The name of the trophy.
  description: string | null; // The description of the trophy.
  icon_70: string; // The URL of the 70x70 trophy icon.
  icon_40: string; // The URL of the 40x40 trophy icon.
  award_id: string | null; // The ID of the award associated with the trophy.
  url: string | null; // A URL associated with the trophy.
}
```

**Usage Example:**

```typescript
// Example: Get user trophies
const trophyList = await redditSdk.api.account.getMyTrophies();
trophyList.data.trophies.forEach(trophyContainer => {
  console.log(trophyContainer.data.name);
});
``` 