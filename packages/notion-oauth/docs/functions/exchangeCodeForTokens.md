## Function: `exchangeCodeForTokens`

Exchanges an authorization code, received from Notion after a user successfully authorizes the application, for an access token.

**Purpose:**
After a user authorizes your integration, Notion redirects them back to your specified `redirectUri` with an authorization `code` in the URL's query parameters. This function sends that code, along with your client credentials, to Notion's token endpoint to receive an access token in return. This access token is required to make authenticated API requests on behalf of the user.

**Parameters:**

- `code`: `string` - Required. The authorization code provided by Notion in the query parameters of the redirect URI after a user completes the authorization flow.

**Return Value:**

- `Promise<NotionTokenResponse>`: A promise that resolves to an object containing the token information.
- **`NotionTokenResponse` Object Structure:**
  - `access_token`: `string` - The access token for the user. This should be stored securely.
  - `bot_id`: `string` - The ID of the bot associated with this integration.
  - `duplicated_template_id`: `string | null` - The ID of the duplicated template, if the user duplicated a template to grant access.
  - `owner`: `object` - An object containing information about the user who authorized the integration.
    - `type`: `string` - The type of owner, always "user".
    - `user`: `object` - The Notion user object.
  - `workspace_icon`: `string | null` - A URL to the icon of the workspace.
  - `workspace_id`: `string` - The ID of the workspace where the integration was authorized.
  - `workspace_name`: `string | null` - The name of the workspace.

**Examples:**

```typescript
// This code would typically run in your OAuth callback route handler.
// 'authorizationCode' is extracted from the callback URL's query parameters.
// e.g., from https://your-app.com/oauth/callback?code=...&state=...
const authorizationCode = '<the-code-from-notion-redirect>';

async function getToken(code: string) {
  try {
    const tokenResponse = await notionOAuth.exchangeCodeForTokens(code);
    console.log('Successfully obtained tokens!');
    console.log('Access Token:', tokenResponse.access_token);
    console.log('Bot ID:', tokenResponse.bot_id);

    // Store the tokenResponse securely, associating it with the user.
    // For example, save `tokenResponse.access_token` to your database.
    return tokenResponse;
  } catch (error) {
    console.error('Failed to exchange authorization code for token:', error);
    // Handle the error, e.g., by showing an error message to the user.
  }
}

getToken(authorizationCode);
```
