## Function: `refreshAccessToken`

Refreshes the access token using a refresh token.

**Purpose:**
Obtains a new access token using the provided refresh token.

**Parameters:**
- `refreshToken`: string - The refresh token obtained during initial authorization.

**Return Value:**
void

**Examples:**
```typescript
await sdk.refreshAccessToken(process.env.REDDIT_REFRESH_TOKEN);
```