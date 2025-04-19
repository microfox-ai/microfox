# getAuthUrl()

Generates the authorization URL for the OAuth flow.

```typescript
const url = xOAuth.getAuthUrl(
  ['tweet.read', 'users.read'],
  'your-state',
  codeChallenge,
);
```

## Parameters

- `scopes`: Array of OAuth scopes to request (e.g., 'tweet.read', 'users.read')
- `state`: State parameter for CSRF protection
- `codeChallenge`: The code challenge generated from the verifier

## Returns

The complete authorization URL to redirect the user to.

## Example

```typescript
const state = xOAuth.generateState();
const codeChallenge = await xOAuth.generateCodeChallenge(state.codeVerifier);
const authUrl = xOAuth.getAuthUrl(['tweet.read'], state, codeChallenge);
```
