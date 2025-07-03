## Function: `getUserTrophies`

Retrieves the trophies for a specific user.

**Parameters:**

- `username`: string - The username of the user.

**Return Type:**

- `Promise<TrophyList>`: A promise that resolves to a `TrophyList` object.

**TrophyList Object Details:**
- `kind`: string (always 'TrophyList')
- `data`: object
  - `trophies`: `Trophy[]` - An array of trophy objects.

**Trophy Object Details:**
- `kind`: string (always 't6')
- `data`: object
    - `icon_70`: string - URL for the 70x70 icon.
    - `granted_at`: number | null - UTC timestamp of when the trophy was granted.
    - `url`: string | null - A URL associated with the trophy.
    - `name`: string - The name of the trophy (e.g., "Verified Email").
    - `award_id`: string | null - The ID of the award, if applicable.
    - `id`: string - The unique ID of the trophy.
    - `icon_40`: string - URL for the 40x40 icon.
    - `description`: string | null - The description of the trophy.

**Usage Example:**

```typescript
const userTrophies = await reddit.users.getUserTrophies({ username: 'spez' });
console.log(userTrophies.data.trophies.map(t => t.data.name));
``` 
