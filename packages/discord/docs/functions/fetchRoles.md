## Function: `fetchRoles`

Fetches all roles in a guild.

**Purpose:**
Retrieves a list of all roles within a specific guild.

**Parameters:**

- `guildId`: string - The ID of the guild to fetch roles from.

**Return Value:**
A `Promise` that resolves to an array of role objects.

**Examples:**

```typescript
const roles = await discordSdk.fetchRoles('1234567890');
```
