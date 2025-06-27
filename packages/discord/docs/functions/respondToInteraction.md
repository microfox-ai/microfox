## Function: `respondToInteraction`

Responds to a slash command interaction.

**Purpose:**
Sends a response back to the user who interacted with a slash command.

**Parameters:**

- `interactionToken`: string - The interaction token received from Discord.
- `response`: object - The response data.
  - `content`: string (optional) - The text content of the response.
  - `embeds`: array (optional) - An array of embed objects.
  - `components`: array (optional) - An array of component objects (buttons, menus, etc.).
  - `ephemeral`: boolean (optional) - Whether the response should be ephemeral (only visible to the user who triggered the command).

**Return Value:**
A `Promise` that resolves when the response is sent.

**Examples:**

```typescript
await discordSdk.respondToInteraction('interaction_token', {
  content: 'Hello from the command handler!',
});
```
