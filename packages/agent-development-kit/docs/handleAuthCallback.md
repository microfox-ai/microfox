## Function: `handleAuthCallback`

Handles the authentication callback.

**Purpose:**
Processes the callback parameters received after authentication.

**Parameters:**
- `callbackParams`: Record<string, string>, required. The parameters received from the authentication callback.

**Return Value:**
- `Promise<AuthResponse>`: A promise that resolves to the authentication response.
  - `accessToken`: string. Access token for authentication.
  - `refreshToken`: string, optional. Refresh token for authentication.
  - `expiresAt`: number, optional. Expiration timestamp for the access token.

**Examples:**
```typescript
const callbackParams = { code: "authCode123", state: "someState" };
const authResponse = await adk.handleAuthCallback(callbackParams);
console.log(authResponse);
```