# revokeToken()

Revokes an access or refresh token.

```typescript
await xOAuth.revokeToken(token, 'access_token');
```

## Parameters

- `token`: The token to revoke.
- `tokenTypeHint`: Optional. Specifies whether the token is an access token or a refresh token. Defaults to 'access_token'.

## Returns

An object indicating whether the token was revoked.