## Function: `exchangeCodeForTokens`

Exchanges the authorization code received from Slack for an access token.

**Purpose:**
Retrieves an access token that can be used to make API calls on behalf of the user.

**Parameters:**

- `code`: string - The authorization code received from Slack. **Required.**

**Return Value:**

- `Promise<SlackOAuthResponse>` - A promise that resolves to an object containing the access token and other information.

  - `ok`: boolean - Indicates whether the request was successful.
  - `access_token`: string - The access token.
  - `token_type`: string - The type of token (e.g., "bearer").
  - `scope`: string - The granted scopes.
  - `bot_user_id`: string - The ID of the bot user.
  - `app_id`: string - The ID of the app.
  - `team`: SlackTeam - Information about the Slack team.
    - `id`: string - The team ID.
    - `name`: string - The team name.
  - `enterprise`: SlackEnterprise - Information about the Slack enterprise (if applicable).
    - `id`: string - The enterprise ID.
    - `name`: string - The enterprise name.
  - `authed_user`: SlackAuthedUser - Information about the authenticated user (if applicable).
    - `id`: string - The user ID.
    - `scope`: string - The user scopes.
    - `access_token`: string - The user access token.
    - `token_type`: string - The user token type.

**Examples:**

```typescript
// Example usage
try {
  const tokenResponse = await slackOAuth.exchangeCodeForTokens('YOUR_CODE');
  console.log(tokenResponse);
} catch (error) {
  console.error('Error exchanging code for token:', error);
}
```
