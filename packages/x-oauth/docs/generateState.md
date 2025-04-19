# generateState()

Generates a random state value for OAuth flow.

```typescript
const state = xOAuth.generateState();
console.log(state.codeVerifier);
```

## Returns

An object containing the code verifier for PKCE flow.

## Example

```typescript
const { codeVerifier } = xOAuth.generateState();
const codeChallenge = await xOAuth.generateCodeChallenge(codeVerifier);
```
