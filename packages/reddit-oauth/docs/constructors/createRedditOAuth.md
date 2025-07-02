# `@microfox/reddit-oauth`

This package provides an SDK for authenticating with the Reddit API using OAuth 2.0.

## `createRedditOAuth(config)`

Initializes a new instance of the `RedditOAuthSdk`. This is the entry point for using the SDK.

### Parameters

- `config`: An object containing your Reddit OAuth application credentials and settings.
  - `clientId` (string): Your Reddit application's client ID.
  - `clientSecret` (string): Your Reddit application's client secret.
  - `redirectUri` (string, optional): The URI to redirect to after authorization.
  - `scopes` (string[], optional): A list of permissions to request from the user. Defaults to `[]`.

### Returns

An instance of `RedditOAuthSdk`.

### Usage Example

```typescript
import { createRedditOAuth } from '@microfox/reddit-oauth';

const redditOAuth = createRedditOAuth({
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  redirectUri: process.env.REDDIT_REDIRECT_URI,
  scopes: ['identity', 'read', 'mysubreddits'],
});
```

## `RedditOAuthSdk` Instance Methods

The `RedditOAuthSdk` instance provides the following methods to handle the OAuth 2.0 flow.

### `getAuthorizationUrl(state, duration)`

Generates the full authorization URL to redirect a user to for granting permissions.

- `state` (string): A unique, unguessable string to prevent CSRF attacks.
- `duration` ('temporary' | 'permanent'): The duration of the requested token. Defaults to `'permanent'`.
- **Returns**: `string` - The complete authorization URL.

### `getAuthUrl()`

A simplified method to get an authorization URL with a randomly generated `state` and a `'permanent'` duration.

- **Returns**: `string` - The complete authorization URL.

### `exchangeCodeForTokens(code)`

Exchanges an authorization code (received from the redirect) for access and refresh tokens. It also validates the access token to ensure it's usable.

- `code` (string): The authorization code from the callback query parameters.
- **Returns**: `Promise<RedditTokenResponse>` - A promise that resolves to the token response from Reddit.

### `refreshAccessToken(refreshToken)`

Refreshes an expired access token using a refresh token.

- `refreshToken` (string): The refresh token.
- **Returns**: `Promise<RedditRefreshTokenResponse>` - A promise that resolves to the new token response.

### `validateAccessToken(accessToken)`

Checks if a given access token is still valid by making a request to the Reddit API.

- `accessToken` (string): The access token to validate.
- **Returns**: `Promise<boolean>` - A promise that resolves to `true` if the token is valid, `false` otherwise.

### `revokeToken(token, tokenTypeHint)`

Revokes an access or refresh token.

- `token` (string): The token to revoke.
- `tokenTypeHint` ('access_token' | 'refresh_token', optional): A hint for the server about the token type.
- **Returns**: `Promise<void>`
