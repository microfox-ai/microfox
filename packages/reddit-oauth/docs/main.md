# Microfox Reddit OAuth

A TypeScript OAuth package for Reddit.

## Installation

```bash
npm install @microfox/reddit-oauth
```

## Authentication

This SDK uses OAuth 2.0 for authentication. You need to provide the following credentials:

- `accessToken`: Your OAuth access token
- `refreshToken`: Your OAuth refresh token
- `clientId`: Your OAuth client ID
- `clientSecret`: Your OAuth client secret

You can obtain these credentials by following the OAuth 2.0 flow for Reddit.

## Environment Variables

The following environment variables are used by this SDK:

- `REDDIT_CLIENT_ID`: Your Reddit application's client ID. Obtain this from your Reddit app settings. (Required)
- `REDDIT_CLIENT_SECRET`: Your Reddit application's client secret. Obtain this from your Reddit app settings. (Required)
- `REDDIT_REDIRECT_URI`: The redirect URI you specified when creating your Reddit app. (Required)

## Additional Information

To obtain OAuth credentials for Reddit:

1. Go to https://www.reddit.com/prefs/apps

2. Click on 'create app' or 'create another app' at the bottom

3. Fill in the required information:

   - Name: Your app's name

   - App type: Choose 'web app' for most cases

   - Description: Brief description of your app

   - About URL: Your app's website (if applicable)

   - Redirect URI: The URI where Reddit will redirect after authorization

4. Click 'create app'

5. You'll receive a Client ID and Client Secret. Keep these secure.

Environment variables:

- REDDIT_CLIENT_ID: Your Reddit application's client ID

- REDDIT_CLIENT_SECRET: Your Reddit application's client secret

- REDDIT_REDIRECT_URI: The redirect URI you specified when creating the app

To set up environment variables:

1. Create a .env file in your project root (if not already present)

2. Add the following lines to the .env file:

   REDDIT_CLIENT_ID=your_client_id_here

   REDDIT_CLIENT_SECRET=your_client_secret_here

   REDDIT_REDIRECT_URI=your_redirect_uri_here

3. Use a package like dotenv to load these variables in your application

Important notes:

- Reddit's OAuth implementation uses comma-separated scopes instead of space-separated

- The authorization endpoint is https://ssl.reddit.com/api/v1/authorize

- The token endpoint is https://ssl.reddit.com/api/v1/access_token

- Access tokens expire after 1 hour (3600 seconds)

- To get a refresh token, include 'duration=permanent' in the initial authorization request

- Rate limits: https://github.com/reddit-archive/reddit/wiki/API#rules

  - 60 requests per minute

  - OAuth2 clients may make up to 600 requests per 10 minutes

  - Monitor the X-Ratelimit headers in API responses for current limits and usage

For more detailed information, refer to the Reddit API documentation: https://www.reddit.com/dev/api/oauth

## Constructor

## [createRedditOAuth](./docs/createRedditOAuth.md)

Initializes a new instance of the RedditOAuthSdk.

This SDK provides methods for authenticating with the Reddit API using OAuth 2.0.

Parameters:

- `config`: An object containing the client ID, client secret, redirect URI, and scopes.

Usage Example:

```typescript
import { createRedditOAuth } from '@microfox/reddit-oauth';

const redditOAuth = createRedditOAuth({
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  redirectUri: process.env.REDDIT_REDIRECT_URI,
  scopes: ['identity', 'read'],
});
```

## Functions

## [getAuthorizationUrl](./docs/getAuthorizationUrl.md)

Generates the authorization URL used to initiate the OAuth 2.0 flow.

Parameters:

- `state`: A string used to prevent CSRF attacks. This value will be returned in the redirect URI.
- `duration`: The duration of the access token. Can be either 'temporary' or 'permanent' (default).

Returns:

- The authorization URL as a string.

Usage Example:

```typescript
const authorizationUrl = redditOAuth.getAuthorizationUrl(
  'random_string',
  'permanent',
);
console.log(authorizationUrl);
```

## [getAccessToken](./docs/getAccessToken.md)

Retrieves an access token from Reddit using the authorization code obtained from the redirect URI.

Parameters:

- `code`: The authorization code.

Returns:

- A Promise that resolves to an object containing the access token, token type, expiry time, scope, and refresh token (if requested).

Usage Example:

```typescript
const tokenResponse = await redditOAuth.getAccessToken('authorization_code');
console.log(tokenResponse);
```

## [refreshAccessToken](./docs/refreshAccessToken.md)

Refreshes an existing access token using a refresh token.

Parameters:

- `refreshToken`: The refresh token.

Returns:

- A Promise that resolves to an object containing the new access token, token type, expiry time, and scope.

Usage Example:

```typescript
const refreshTokenResponse =
  await redditOAuth.refreshAccessToken('refresh_token');
console.log(refreshTokenResponse);
```

## [validateAccessToken](./docs/validateAccessToken.md)

Validates an access token by making a request to the Reddit API.

Parameters:

- `accessToken`: The access token to validate.

Returns:

- A Promise that resolves to a boolean indicating whether the access token is valid.

Usage Example:

```typescript
const isValid = await redditOAuth.validateAccessToken('access_token');
console.log(isValid);
```

## [revokeToken](./docs/revokeToken.md)

Revokes an access token or refresh token.

Parameters:

- `token`: The token to revoke.
- `tokenTypeHint`: An optional hint indicating the type of token being revoked. Can be either 'access_token' or 'refresh_token'.

Returns:

- A Promise that resolves when the token has been revoked.

Usage Example:

```typescript
await redditOAuth.revokeToken('access_token', 'access_token');
```
