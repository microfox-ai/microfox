## Function: `getAccessToken`

Exchanges an authorization code for an access token.

**Purpose:**
This function completes the OAuth flow by exchanging the authorization code received from Fillout for an access token.

**Parameters:**

- `params`: AuthorizationCodeParams (required)
  - An object containing the authorization code.
    - `code`: string (required)
      - The authorization code received from the authorization endpoint.

**Return Value:**

- `Promise<AccessTokenResponse>`
  - A promise that resolves to an object containing the access token and base URL.
    - `access_token`: string
      - The access token for authenticating API requests.
    - `base_url`: string
      - The base URL for the Fillout API. Must be a valid URL.

**Examples:**

```typescript
// Example: Exchanging the authorization code for an access token
async function getToken() {
  const tokenResponse = await filloutOAuth.getAccessToken({ code: "auth_code_123" });
  console.log(tokenResponse);
}

getToken();
```