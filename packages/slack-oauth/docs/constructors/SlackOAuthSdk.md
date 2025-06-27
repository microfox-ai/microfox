## Constructor: `SlackOAuthSdk`

Initializes a new instance of the `SlackOAuthSdk` class.

**Purpose:**
Handles the OAuth flow for Slack, enabling applications to authenticate users and interact with the Slack API.

**Parameters:**

- `config`: SlackOAuthConfig - An object containing the configuration options for the SDK.

  - `clientId`: string - The Client ID obtained from the Slack App Management page. **Required.**
  - `clientSecret`: string - The Client Secret obtained from the Slack App Management page. **Required.**
  - `redirectUri`: string - The URL where Slack will redirect the user after authorization. Must be a valid URL. **Required.**
  - `scopes`: array<string> - Array of scopes requested for the bot token. **Required.**
  - `userScopes`: array<string> - Optional array of scopes requested for the user token.
  - `team`: string - Optional ID of the Slack workspace to authorize against.
  - `isGovSlack`: boolean - Optional flag to use GovSlack endpoints. Default is `false`.

**Return Value:**

- `SlackOAuthSdk` - A new instance of the `SlackOAuthSdk` class.

**Examples:**

```typescript
// Example 1: Minimal usage with required arguments
const slackOAuth = new SlackOAuthSdk({
  clientId: process.env.SLACK_CLIENT_ID!,
  clientSecret: process.env.SLACK_CLIENT_SECRET!,
  redirectUri: process.env.SLACK_REDIRECT_URI!,
  scopes: process.env.SCOPES,
});

// Example 2: Full usage with all optional arguments
const slackOAuth = new SlackOAuthSdk({
  clientId: process.env.SLACK_CLIENT_ID!,
  clientSecret: process.env.SLACK_CLIENT_SECRET!,
  redirectUri: process.env.SLACK_REDIRECT_URI!,
  scopes: process.env.SCOPES,
  userScopes: process.env.USER_SCOPES || ['identity.basic'],
  team: 'T12345678',
  isGovSlack: true,
});
```
