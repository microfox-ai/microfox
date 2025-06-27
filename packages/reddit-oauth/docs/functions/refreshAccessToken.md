Refreshes an existing access token using a refresh token.

Parameters:

- `refreshToken`: The refresh token.

Returns:

- A Promise that resolves to an object containing the new access token, token type, expiry time, and scope.

Usage Example:

```typescript
const refreshTokenResponse =
  await redditOAuth.refreshAccessToken('refresh_token');
console.log(refreshTokenResponse);
```
