## Function: `refreshAccessToken`

Refreshes the access token.

**Purpose:**
Obtains a new access token using the refresh token.

**Parameters:**

- `refreshToken` (string, required): The refresh token used to obtain a new access token.

**Return Value:**

- `Promise<{ accessToken: string; expiresIn: number }>`: A promise that resolves to an object containing the new access token and its expiration time in seconds.
  - `accessToken` (string): The new access token.
  - `expiresIn` (number): The expiration time of the access token in seconds.

**Examples:**

```typescript
// Example: Refresh the access token
const newTokens = await sdk.refreshAccessToken(process.env.GOOGLE_REFRESH_TOKEN);
```