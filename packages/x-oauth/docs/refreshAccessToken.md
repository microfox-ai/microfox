# refreshAccessToken()

Refreshes an access token using a refresh token.

```typescript
const tokens = await xOAuth.refreshAccessToken(refreshToken);
console.log(tokens);
```

## Parameters

- `refreshToken`: The refresh token.

## Returns

An object containing the new access token and refresh token.