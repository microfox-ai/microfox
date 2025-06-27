## Function: `registerGlobalSlashCommand`

Registers global slash commands for the bot.

**Purpose:**
Creates a new slash command that can be used in any guild where the bot is present.

**Parameters:**

- `command`: object<DiscordSlashCommandSchema> - An object defining the command's properties (same structure as in `registerSlashCommand`).

**Return Value:**
A `Promise` that resolves to the registered command object.

**Examples:**

```typescript
await discordSdk.registerGlobalSlashCommand({
  name: 'help',
  description: 'Shows help information',
});
```
