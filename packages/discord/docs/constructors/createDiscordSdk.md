## Constructor: `createDiscordSdk`

Creates a new instance of the Discord SDK. This function initializes the SDK with the provided configuration, sets up the necessary headers for authentication, and returns an object containing all the available API methods.

**Purpose:**
Initializes the Discord SDK with user configuration.

**Parameters:**

- `config`: object<DiscordConfig>
  - `token`: string - The Discord bot token. This is required for authenticating with the Discord API.

**Return Value:**
An object containing all the available API methods.

**Examples:**

```typescript
// Example 1: Using environment variables
const discordSdk = createDiscordSdk({
  token: process.env.DISCORD_BOT_TOKEN,
});

// Example 2: Providing the token directly
const discordSdk = createDiscordSdk({
  token: 'YOUR_DISCORD_BOT_TOKEN',
});
```
