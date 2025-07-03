## Function: `handleInteraction`

Handles a slash command interaction.

**Purpose:**
This function is called when a user interacts with a slash command. It retrieves the corresponding command handler and executes it.

**Parameters:**

- `interaction`: object - The raw interaction object received from Discord.

**Return Value:**
A `Promise` that resolves when the command handler is executed.

**Examples:**

```typescript
// Example usage in a Discord bot framework
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    try {
      await discordSdk.handleInteraction(interaction);
    } catch (error) {
      console.error('Error handling interaction:', error);
    }
  }
});
```
