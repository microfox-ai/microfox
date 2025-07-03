## Function: `refreshAccessToken`

Refreshes the access token using a refresh token.

**Purpose:**
Obtains a new access token using the provided refresh token.

**Parameters:**

- `refreshToken`: `string` (required)
  - The refresh token obtained during the OAuth 2.0 flow.

**Return Value:**

- `Promise<void>`
  - Resolves if the access token is successfully refreshed.
  - Rejects with an error if the refresh fails.

**Examples:**

```typescript
try {
  await sdk.refreshAccessToken('<refresh_token>');
  console.log('Access token refreshed');
} catch (error) {
  console.error('Access token refresh failed:', error.message);
}
```
