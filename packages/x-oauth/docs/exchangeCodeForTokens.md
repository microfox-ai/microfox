# exchangeCodeForTokens()

Exchanges an authorization code for access and refresh tokens.

```typescript
const tokens = await xOAuth.exchangeCodeForTokens(code, state.codeVerifier);
```

## Parameters

- `code`: The authorization code received from the callback
- `codeVerifier`: The code verifier used to generate the challenge

## Returns

An object containing the access and refresh tokens.

## Example

```typescript
try {
  const tokens = await xOAuth.exchangeCodeForTokens(code, state.codeVerifier);
  console.log('Access Token:', tokens.accessToken);
  console.log('Refresh Token:', tokens.refreshToken);
} catch (error) {
  console.error('Failed to exchange code for tokens:', error);
}
```
