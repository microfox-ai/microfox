## Function: `fetchGlobalSlashCommands`

Fetches all global slash commands.

**Purpose:**
Retrieves a list of all global slash commands registered for the bot.

**Parameters:**
None

**Return Value:**
A `Promise` that resolves to an array of slash command objects.

**Examples:**

```typescript
const commands = await discordSdk.fetchGlobalSlashCommands();
```
