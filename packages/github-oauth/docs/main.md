# @microfox/github-oauth

A robust TypeScript SDK for GitHub OAuth 2.0 authentication and API integration.

## Features

- ✅ **Complete OAuth 2.0 Flow**: Full implementation of GitHub's OAuth authorization flow
- ✅ **PKCE Support**: Enhanced security with Proof Key for Code Exchange
- ✅ **TypeScript First**: Full type safety with comprehensive TypeScript definitions
- ✅ **User Profile & Emails**: Fetch user information and email addresses
- ✅ **Token Management**: Token validation and revocation
- ✅ **Error Handling**: Comprehensive error handling with descriptive messages
- ✅ **All GitHub Scopes**: Support for all GitHub OAuth scopes
- ✅ **Zod Validation**: Runtime validation of all API responses

## Installation

```bash
npm install @microfox/github-oauth
```

## Quick Start

### 1. Basic OAuth Flow

```typescript
import { createGitHubOAuth } from '@microfox/github-oauth';

const githubOAuth = createGitHubOAuth({
  clientId: 'your-github-client-id',
  clientSecret: 'your-github-client-secret',
  redirectUri: 'http://localhost:3000/auth/github/callback',
  scopes: ['user', 'user:email', 'public_repo'],
});

// Generate authorization URL
const authUrl = await githubOAuth.getAuthUrl({
  state: 'random-state-string',
});
console.log('Visit:', authUrl);

// Exchange code for tokens (in your callback handler)
const tokenResponse = await githubOAuth.exchangeCodeForTokens(code);
console.log('Access Token:', tokenResponse.access_token);
```

### 2. OAuth Flow with PKCE (Recommended for SPAs)

```typescript
import { createGitHubOAuth } from '@microfox/github-oauth';

const githubOAuth = createGitHubOAuth({
  clientId: 'your-github-client-id',
  clientSecret: 'your-github-client-secret',
  redirectUri: 'http://localhost:3000/auth/github/callback',
  scopes: ['user', 'user:email'],
});

// Generate PKCE parameters
const pkceParams = await githubOAuth.generatePKCEParams();

// Store code verifier securely (localStorage, session, etc.)
localStorage.setItem('github_code_verifier', pkceParams.codeVerifier);

// Generate authorization URL with PKCE
const authUrl = await githubOAuth.getAuthUrl({
  state: 'random-state-string',
  usePKCE: true,
  codeChallenge: pkceParams.codeChallenge,
});

// In your callback handler
const codeVerifier = localStorage.getItem('github_code_verifier');
const tokenResponse = await githubOAuth.exchangeCodeForTokens(code, codeVerifier);
```

### 3. Get Complete User Information

```typescript
// Get complete OAuth response with user information
const completeResponse = await githubOAuth.getCompleteOAuthResponse(code);

console.log('User:', completeResponse.user);
console.log('Emails:', completeResponse.emails);
console.log('Access Token:', completeResponse.access_token);
```

### 4. User Profile and Email Management

```typescript
const accessToken = 'your-access-token';

// Get user profile
const userProfile = await githubOAuth.getUserProfile(accessToken);
console.log('User:', userProfile.login, userProfile.name);

// Get user emails
const emails = await githubOAuth.getUserEmails(accessToken);
console.log('Primary Email:', emails.find(email => email.primary)?.email);

// Get complete identity information
const identity = await githubOAuth.getUserIdentity(accessToken);
```

### 5. Token Validation and Revocation

```typescript
// Validate access token
try {
  const user = await githubOAuth.validateAccessToken(accessToken);
  console.log('Token is valid for user:', user.login);
} catch (error) {
  console.log('Token is invalid');
}

// Revoke access token
await githubOAuth.revokeToken(accessToken);
console.log('Token revoked successfully');
```

## Configuration Options

```typescript
interface GitHubOAuthConfig {
  clientId: string;           // GitHub OAuth App Client ID
  clientSecret: string;       // GitHub OAuth App Client Secret
  redirectUri: string;        // Callback URL registered with your app
  scopes: string[];          // Array of GitHub OAuth scopes
  state?: string;            // Optional state parameter for CSRF protection
  allowSignup?: boolean;     // Allow users to sign up during OAuth flow
  login?: string;            // Suggest specific account for sign-in
}
```

## Available Scopes

This package supports all GitHub OAuth scopes. Here are some commonly used ones:

### User Scopes
- `user` - Full access to user profile (includes user:email and user:follow)
- `user:email` - Access to user email addresses
- `user:follow` - Access to follow/unfollow users

### Repository Scopes
- `repo` - Full access to private and public repositories
- `public_repo` - Access to public repositories only
- `repo:status` - Access to commit statuses
- `repo_deployment` - Access to deployment statuses

### Organization Scopes
- `read:org` - Read-only access to organization membership
- `write:org` - Read/write access to organization membership
- `admin:org` - Full control of organizations and teams

### Other Scopes
- `gist` - Create and edit gists
- `notifications` - Access to notifications
- `workflow` - Update GitHub Actions workflow files

For a complete list of available scopes, see the [scopes.json](./scopes.json) file.

## API Reference

### GitHubOAuthSdk

#### Methods

##### `getAuthUrl(options?): Promise<string>`
Generate the authorization URL for GitHub OAuth.

**Parameters:**
- `options.state?: string` - State parameter for CSRF protection
- `options.usePKCE?: boolean` - Enable PKCE flow
- `options.codeChallenge?: string` - PKCE code challenge

**Returns:** Authorization URL string

##### `generatePKCEParams(): Promise<PKCEParams>`
Generate PKCE parameters for enhanced security.

**Returns:** Object with `codeVerifier`, `codeChallenge`, and `codeChallengeMethod`

##### `exchangeCodeForTokens(code, codeVerifier?): Promise<GitHubTokenResponse>`
Exchange authorization code for access tokens.

**Parameters:**
- `code: string` - Authorization code from callback
- `codeVerifier?: string` - PKCE code verifier (if using PKCE)

**Returns:** Token response with access_token, scope, and token_type

##### `getUserProfile(accessToken): Promise<GitHubUser>`
Fetch authenticated user's profile information.

##### `getUserEmails(accessToken): Promise<GitHubEmail[]>`
Fetch authenticated user's email addresses.

##### `getUserIdentity(accessToken): Promise<GitHubIdentityInfo>`
Fetch complete user identity (profile + emails).

##### `validateAccessToken(accessToken): Promise<GitHubUser>`
Validate an access token by fetching user profile.

##### `revokeToken(accessToken): Promise<void>`
Revoke an access token.

##### `getCompleteOAuthResponse(code, codeVerifier?, includeUserInfo?): Promise<GitHubOAuthResponse>`
Get complete OAuth response including tokens and user information.

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
  const tokenResponse = await githubOAuth.exchangeCodeForTokens(code);
} catch (error) {
  if (error.message.includes('OAuth error:')) {
    // Handle OAuth-specific errors
    console.error('OAuth Error:', error.message);
  } else {
    // Handle other errors (network, validation, etc.)
    console.error('Error:', error.message);
  }
}
```

## Security Best Practices

1. **Always use HTTPS** in production for redirect URIs
2. **Use PKCE** for single-page applications and mobile apps
3. **Validate state parameter** to prevent CSRF attacks
4. **Store tokens securely** - never expose them in client-side code
5. **Use minimal scopes** - only request permissions you actually need
6. **Implement token refresh** for long-lived applications

## Examples

### Next.js App Router Example

```typescript
// app/auth/github/route.ts
import { createGitHubOAuth } from '@microfox/github-oauth';
import { NextRequest, NextResponse } from 'next/server';

const githubOAuth = createGitHubOAuth({
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  redirectUri: process.env.GITHUB_REDIRECT_URI!,
  scopes: ['user', 'user:email'],
});

export async function GET() {
  const authUrl = await githubOAuth.getAuthUrl({
    state: generateRandomState(),
  });
  
  return NextResponse.redirect(authUrl);
}
```

```typescript
// app/auth/github/callback/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  
  try {
    const response = await githubOAuth.getCompleteOAuthResponse(code);
    
    // Store tokens securely and redirect to success page
    return NextResponse.redirect('/dashboard');
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Express.js Example

```typescript
import express from 'express';
import { createGitHubOAuth } from '@microfox/github-oauth';

const app = express();
const githubOAuth = createGitHubOAuth({
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  redirectUri: 'http://localhost:3000/auth/github/callback',
  scopes: ['user', 'user:email', 'public_repo'],
});

app.get('/auth/github', async (req, res) => {
  const authUrl = await githubOAuth.getAuthUrl({
    state: generateRandomState(),
  });
  res.redirect(authUrl);
});

app.get('/auth/github/callback', async (req, res) => {
  const { code, state } = req.query;
  
  try {
    const response = await githubOAuth.getCompleteOAuthResponse(code as string);
    
    // Store user data and tokens
    req.session.user = response.user;
    req.session.accessToken = response.access_token;
    
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## TypeScript Support

This package is written in TypeScript and provides full type definitions:

```typescript
import type {
  GitHubOAuthConfig,
  GitHubTokenResponse,
  GitHubUser,
  GitHubEmail,
  GitHubOAuthResponse,
  PKCEParams,
} from '@microfox/github-oauth';
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For support, please open an issue on our GitHub repository or contact our support team. 