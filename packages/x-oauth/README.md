# Microfox X OAuth SDK

Microfox X OAuth SDK for TypeScript

## Installation

```bash
npm install @microfox/x-oauth
```

## Authentication

This SDK uses OAuth 2.0 for authentication. You need to provide the following credentials:

- `clientId`: Your OAuth client ID
- `clientSecret`: Your OAuth client secret
- `redirectUri`: Your application's redirect URI

You can obtain these credentials by following the OAuth 2.0 flow for X.

## Environment Variables

The following environment variables are used by this SDK:

- `X_CLIENT_ID`: Your X application's Client ID. (Required)
- `X_CLIENT_SECRET`: Your X application's Client Secret. (Required)
- `X_REDIRECT_URI`: Your application's redirect URI. (Required)

## Usage

```typescript
import { createXOAuth } from '@microfox/x-oauth';

// Initialize the SDK
const xOAuth = createXOAuth({
  clientId: process.env.X_CLIENT_ID!,
  clientSecret: process.env.X_CLIENT_SECRET!,
  redirectUri: process.env.X_REDIRECT_URI!,
});

// Generate a state and code challenge
const state = xOAuth.generateState();
const codeChallenge = await xOAuth.generateCodeChallenge(state.codeVerifier);

// Get the authorization URL
const authUrl = xOAuth.getAuthUrl(
  ['tweet.read', 'users.read'],
  'your-state',
  codeChallenge,
);

// After user authorization, exchange the code for tokens
const tokens = await xOAuth.exchangeCodeForTokens(code, state.codeVerifier);

// Refresh the access token when it expires
const newTokens = await xOAuth.refreshAccessToken(tokens.refreshToken);

// Validate the access token
const isValid = await xOAuth.validateAccessToken(tokens.accessToken);

// Get client credentials for application-only authentication
const appTokens = await xOAuth.getClientCredentials(apiKey, apiSecretKey);

// Revoke tokens when they're no longer needed
await xOAuth.revokeToken(tokens.accessToken, 'access_token');
```

## OAuth Flow

1. Generate a state using `xOAuth.generateState()`
2. Generate a code challenge using `xOAuth.generateCodeChallenge()`
3. Get the authorization URL with `xOAuth.getAuthUrl()`
4. After user authorization, exchange the code for tokens with `xOAuth.exchangeCodeForTokens()`
5. Use `xOAuth.refreshAccessToken()` to get a new access token when it expires
6. Validate tokens with `xOAuth.validateAccessToken()`
7. Revoke tokens with `xOAuth.revokeToken()` when they're no longer needed

## API Reference

### Constructor

#### `createXOAuth(config: XOAuthConfig): XOAuthSdk`

Creates a new instance of the XOAuthSdk.

```typescript
const xOAuth = createXOAuth({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI',
});
```

### Methods

#### `generateState(): XOAuthCodeVerifier`

Generates a random state value for OAuth flow.

```typescript
const state = xOAuth.generateState();
console.log(state.codeVerifier);
```

#### `generateCodeChallenge(codeVerifier: string): Promise<string>`

Generates a code challenge from a code verifier using SHA-256.

```typescript
const challenge = await xOAuth.generateCodeChallenge(state.codeVerifier);
```

#### `getAuthUrl(scopes: string[], state: string, codeChallenge: string): string`

Generates the authorization URL for the OAuth flow.

```typescript
const url = xOAuth.getAuthUrl(['tweet.read', 'users.read'], state, challenge);
```

#### `exchangeCodeForTokens(code: string, codeVerifier: string): Promise<XOAuthTokens>`

Exchanges an authorization code for access and refresh tokens.

```typescript
const tokens = await xOAuth.exchangeCodeForTokens(code, state.codeVerifier);
```

#### `refreshAccessToken(refreshToken: string): Promise<XOAuthTokens>`

Refreshes an access token using a refresh token.

```typescript
const newTokens = await xOAuth.refreshAccessToken(refreshToken);
```

#### `validateAccessToken(accessToken: string): Promise<boolean>`

Validates an access token by making a request to the user info endpoint.

```typescript
const isValid = await xOAuth.validateAccessToken(accessToken);
```

#### `revokeToken(token: string, tokenTypeHint?: 'access_token' | 'refresh_token'): Promise<XOAuthRevokeResponse>`

Revokes an access or refresh token.

```typescript
await xOAuth.revokeToken(accessToken, 'access_token');
```

#### `getClientCredentials(apiKey: string, apiSecretKey: string): Promise<XOAuthTokens>`

Gets client credentials token for application-only authentication.

```typescript
const tokens = await xOAuth.getClientCredentials(apiKey, apiSecretKey);
```

## Additional Information

To use this X OAuth SDK, you need to obtain OAuth credentials from the X Developer Portal (https://developer.x.com):

1. Create a new application or use an existing one
2. Navigate to the 'Keys and Tokens' section
3. Note down your Client ID and Client Secret
4. Add your application's redirect URI in the 'User authentication settings' section

### Rate Limits

X has rate limits on API requests. Consult the X API documentation for specific limits.

### Error Handling

The SDK throws errors for HTTP errors and validation failures. Wrap API calls in try-catch blocks.

### Security

Store your Client Secret securely and never expose it in client-side code.

For more details, refer to the X OAuth 2.0 documentation: https://developer.x.com/docs/authentication/oauth2
