## Function: `deferInteraction`

Defers a slash command response.

**Purpose:**
Acknowledges the interaction and allows the bot more time to process the command.

**Parameters:**

- `interactionToken`: string - The interaction token received from Discord.
- `ephemeral`: boolean (optional) - Whether the deferred response should be ephemeral.

**Return Value:**
A `Promise` that resolves when the interaction is deferred.

**Examples:**

```typescript
await discordSdk.deferInteraction('interaction_token');
```
