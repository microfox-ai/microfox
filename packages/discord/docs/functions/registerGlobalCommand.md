## Function: `registerGlobalCommand`

Registers a global command handler.

**Purpose:**
Registers a function to handle a specific global slash command.

**Parameters:**

- `command`: object<DiscordCommandHandlerSchema> - The command handler data (same structure as in `registerCommand`).

**Return Value:**
A `Promise` that resolves when the command is registered.

**Examples:**

```typescript
await discordSdk.registerGlobalCommand({
  name: 'globaltest',
  description: 'Global test command',
  handler: async (interaction, options) => {
    await discordSdk.respondToInteraction(interaction.token, {
      content: 'Global command executed!',
    });
  },
});
```
