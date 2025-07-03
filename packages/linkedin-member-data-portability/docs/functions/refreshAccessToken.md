## Function: `refreshAccessToken`

Refreshes the access token using the refresh token.

**Purpose:**

Obtains a new access token using the refresh token.

**Parameters:**

- `refreshToken` (string, required): The refresh token.

**Return Value:**

- `Promise<{ accessToken: string; refreshToken?: string }>`: An object containing the new access token and optionally a new refresh token.

**Examples:**

```typescript
// Example: Refresh the access token
try {
  const newTokens = await sdk.refreshAccessToken('<refreshToken>');
  console.log('New access token:', newTokens.accessToken);
} catch (error) {
  console.error('Failed to refresh access token:', error);
}
```
