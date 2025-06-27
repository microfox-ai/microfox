Revokes an access token or refresh token.

Parameters:

- `token`: The token to revoke.
- `tokenTypeHint`: An optional hint indicating the type of token being revoked. Can be either 'access_token' or 'refresh_token'.

Returns:

- A Promise that resolves when the token has been revoked.

Usage Example:

```typescript
await redditOAuth.revokeToken('access_token', 'access_token');
```
