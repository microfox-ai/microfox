## Function: `fetchGuildInfo`

Fetches information about a guild (server).

**Purpose:**
Retrieves details about a specific guild, such as its name, icon, members, and channels.

**Parameters:**

- `guildId`: string - The ID of the guild to fetch information about.

**Return Value:**
A `Promise` that resolves to a guild object containing information about the guild.

**Examples:**

```typescript
const guild = await discordSdk.fetchGuildInfo('1234567890');
```
