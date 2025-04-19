# generateCodeChallenge()

Generates a code challenge from a code verifier.

```typescript
const codeVerifier = xOAuth.generateCodeVerifier().codeVerifier;
const codeChallenge = await xOAuth.generateCodeChallenge(codeVerifier);
console.log(codeChallenge);
```

## Parameters

- `codeVerifier`: The code verifier string.

## Returns

The code challenge string.