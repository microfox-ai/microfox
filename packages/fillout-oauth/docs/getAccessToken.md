## Function: `getAccessToken`

Exchanges the authorization code received from the redirect for an access token.

**Purpose:**
This function completes the OAuth flow by retrieving an access token that can be used to make authenticated API requests.

**Parameters:**

- `code`: string (required)
  - The authorization code received from the redirect URL after the user grants authorization.

**Return Value:**

- `Promise<TokenResponse>`
  - A promise that resolves to the token response object.

  **TokenResponse Type:**

  - `access_token`: string
    - The access token for authenticating API requests.
  - `base_url`: string
    - The base URL for making API requests.

**Examples:**

```typescript
// Example: Exchanging the authorization code for an access token
async function getToken(code: string) {
  try {
    const tokenResponse = await filloutOAuth.getAccessToken(code);
    console.log("Token Response:", tokenResponse);
  } catch (error) {
    console.error("Error getting access token:", error);
  }
}

// Example usage with mock code
getToken("mock-authorization-code");
```