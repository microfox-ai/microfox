## Function: `getAccessToken`

Exchanges the authorization code for an access token.

**Purpose:**
This function exchanges the authorization code received from Fillout for an access token, which can then be used to make authenticated API requests.

**Parameters:**

- `code`: string (required). The authorization code received from the redirect URL.

**Return Value:**

- `Promise<TokenResponse>`:
  - `access_token`: string. The access token for authenticating API requests.
  - `base_url`: string. The base URL for making API requests to Fillout. Must be a valid URL.

**Examples:**

```typescript
// Example usage
try {
  const tokenResponse = await sdk.getAccessToken('<authorization_code>');
  console.log(tokenResponse);
} catch (error) {
  console.error('Error getting access token:', error);
}
```