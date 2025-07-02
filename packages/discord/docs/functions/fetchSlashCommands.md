## Function: `fetchSlashCommands`

Fetches all slash commands for a guild.

**Purpose:**
Retrieves a list of all slash commands registered for the bot in a specific guild.

**Parameters:**

- `guildId`: string - The ID of the guild to fetch commands from.

**Return Value:**
A `Promise` that resolves to an array of slash command objects.

**Examples:**

```typescript
const commands = await discordSdk.fetchSlashCommands('1234567890');
```
