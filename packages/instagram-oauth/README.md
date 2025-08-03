# Instagram Business OAuth SDK

A TypeScript SDK for handling Instagram Business OAuth 2.0 authentication flows. This SDK provides a secure and type-safe way to implement Instagram Business API authentication in your applications.

## Features

- 🔐 Secure OAuth 2.0 implementation with built-in CSRF protection
- 🔄 Support for both short-lived and long-lived access tokens
- 🔄 Automatic token refresh functionality
- 🛡️ Built-in state parameter generation and validation
- 📦 TypeScript support with full type definitions
- ✅ Input validation using Zod schemas
- 🎯 Support for Instagram Business API scopes
- 🔒 Secure token exchange and management
- 🔄 Automatic inclusion of INSTAGRAM_BUSINESS_BASIC scope
- 🚀 Zero dependencies (except for development)

## Installation

```bash
npm install @microfox/instagram-oauth
# or
yarn add @microfox/instagram-oauth
```

## Quick Start

```typescript
import {
  InstagramOAuthSdk,
  InstagramScope,
} from '@microfox/instagram-oauth';

// Initialize the SDK
const instagramAuth = new InstagramOAuthSdk({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI',
  scopes: [
    InstagramScope.INSTAGRAM_BUSINESS_CONTENT_PUBLISH,
    InstagramScope.INSTAGRAM_BUSINESS_MANAGE_MESSAGES,
  ],
});

// Get the authorization URL
const authUrl = instagramAuth.getAuthUrl();

// After user authorization, exchange the code for tokens
const tokens = await instagramAuth.exchangeCodeForTokens('AUTHORIZATION_CODE');

// Get a long-lived token (valid for 60 days)
const longLivedToken = await instagramAuth.getLongLivedToken(
  tokens.accessToken,
);

// Refresh the token when needed
const refreshedToken = await instagramAuth.refreshToken(
  longLivedToken.accessToken,
);
```

## API Reference

### Constructor

```typescript
new InstagramOAuthSdk(config: InstagramAuthConfig)
```

#### Configuration Options

- `clientId` (required): Your Instagram application client ID
- `clientSecret` (required): Your Instagram application client secret
- `redirectUri` (required): The redirect URI registered in your Instagram application
- `scopes` (optional): Array of Instagram scopes to request
- `state` (optional): Custom state parameter for CSRF protection (auto-generated if not provided)

### Methods

#### `getAuthUrl(): string`

Generates the Instagram authorization URL that users should be redirected to. Includes:

- Client ID
- Redirect URI
- Requested scopes (automatically includes INSTAGRAM_BUSINESS_BASIC)
- State parameter for CSRF protection

#### `getState(): Promise<string>`

Returns the current state parameter used for CSRF protection.

#### `exchangeCodeForTokens(code: string): Promise<TokenResponse>`

Exchanges an authorization code for access tokens.

Returns:

```typescript
{
  accessToken: string;
  userId: string;
  permissions: string[];
}
```

#### `getLongLivedToken(shortLivedToken: string): Promise<LongLivedTokenResponse>`

Converts a short-lived token (valid for 1 hour) into a long-lived token (valid for 60 days).

Returns:

```typescript
{
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
```

#### `refreshToken(longLivedToken: string): Promise<LongLivedTokenResponse>`

Refreshes a long-lived token before it expires.

Returns:

```typescript
{
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
```

## Available Scopes

- `INSTAGRAM_BUSINESS_BASIC` (automatically included)
- `INSTAGRAM_BUSINESS_CONTENT_PUBLISH`
- `INSTAGRAM_BUSINESS_MANAGE_MESSAGES`
- `INSTAGRAM_BUSINESS_MANAGE_COMMENTS`

## Error Handling

The SDK throws descriptive errors for various scenarios:

- Missing required configuration parameters
- Invalid redirect URI format
- Failed API requests with error messages from Instagram
- Invalid token exchange or refresh operations
- Invalid state parameter validation
- Network errors during API calls

### Error Example

```typescript
try {
  const tokens = await instagramAuth.exchangeCodeForTokens('INVALID_CODE');
} catch (error) {
  if (error instanceof Error) {
    console.error('Authentication failed:', error.message);
  }
}
```

## Security Considerations

- Always validate the state parameter in your callback handler
- Store tokens securely and never expose them in client-side code
- Implement proper error handling
- Use HTTPS for your redirect URI
- Keep your client secret secure
- Regularly refresh long-lived tokens before they expire
- Implement proper token storage and rotation mechanisms
- Monitor token usage and implement rate limiting

## Token Management Best Practices

1. **Short-lived tokens (1 hour)**

   - Use for immediate API calls
   - Exchange for long-lived tokens as soon as possible

2. **Long-lived tokens (60 days)**

   - Store securely in your backend
   - Refresh before expiration
   - Implement automatic refresh mechanisms

3. **Token refresh**
   - Monitor token expiration
   - Implement automatic refresh before expiration
   - Handle refresh failures gracefully

## License

[MIT License](LICENSE)
