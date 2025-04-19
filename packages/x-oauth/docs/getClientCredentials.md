# getClientCredentials()

Gets client credentials token for application-only authentication.

```typescript
const tokens = await xOAuth.getClientCredentials(apiKey, apiSecretKey);
```

## Parameters

- `apiKey`: The API key for application-only authentication
- `apiSecretKey`: The API secret key for application-only authentication

## Returns

An object containing the access token for application-only authentication.

## Example

```typescript
try {
  const tokens = await xOAuth.getClientCredentials(apiKey, apiSecretKey);
  console.log('App-only Access Token:', tokens.accessToken);
} catch (error) {
  console.error('Failed to get client credentials token:', error);
}
```
