Retrieves an access token from Reddit using the authorization code obtained from the redirect URI.

Parameters:

- `code`: The authorization code.

Returns:

- A Promise that resolves to an object containing the access token, token type, expiry time, scope, and refresh token (if requested).

Usage Example:

```typescript
const tokenResponse = await redditOAuth.getAccessToken('authorization_code');
console.log(tokenResponse);
```
