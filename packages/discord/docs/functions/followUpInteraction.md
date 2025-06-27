## Function: `followUpInteraction`

Follows up to a deferred interaction.

**Purpose:**
Sends a message after an interaction has been deferred.

**Parameters:**

- `interactionToken`: string - The interaction token received from Discord.
- `response`: object - The response data (same structure as in `respondToInteraction`).

**Return Value:**
A `Promise` that resolves when the follow-up message is sent.

**Examples:**

```typescript
await discordSdk.followUpInteraction('interaction_token', {
  content: 'This is a follow-up message!',
});
```
