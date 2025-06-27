## Function: `fetchChannels`

Fetches all channels in a guild.

**Purpose:**
Retrieves a list of all channels within a specific guild.

**Parameters:**

- `guildId`: string - The ID of the guild to fetch channels from.

**Return Value:**
A `Promise` that resolves to an array of channel objects.

**Examples:**

```typescript
const channels = await discordSdk.fetchChannels('1234567890');
```
