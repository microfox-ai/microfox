## Function: `refreshAccessToken`

Refreshes the access token.

**Purpose:**

Obtains a new access token using the refresh token.

**Parameters:**

- `refreshToken`: string - The refresh token.

**Return Value:**

- `Promise<void>` - A promise that resolves when the access token is refreshed.

**Examples:**

```typescript
// Example: Refresh access token
await sdk.refreshAccessToken('<refreshToken>');
```
