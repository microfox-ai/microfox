# XOAuthSdk Constructor

Initializes a new instance of the XOAuthSdk.

```typescript
import { createXOAuth } from '@microfox/x-oauth';

const xOAuth = createXOAuth({
  clientId: process.env.X_CLIENT_ID!,
  clientSecret: process.env.X_CLIENT_SECRET!,
  redirectUri: process.env.X_REDIRECT_URI!
});
```

## Parameters

- `config`: An object containing the following properties:
  - `clientId`: Your X application's Client ID.
  - `clientSecret`: Your X application's Client Secret.
  - `redirectUri`: Your application's redirect URI.

## Usage Examples

```typescript
// Initialize the SDK
const xOAuth = createXOAuth({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI'
});

// Generate a code verifier and challenge
const codeVerifier = xOAuth.generateCodeVerifier();
const codeChallenge = await xOAuth.generateCodeChallenge(codeVerifier.codeVerifier);

// Get the authorization URL
const authorizationUrl = await xOAuth.getAuthorizationUrl(['tweet.read'], 'your-state', codeChallenge);

// Redirect the user to the authorization URL
window.location.href = authorizationUrl;
```