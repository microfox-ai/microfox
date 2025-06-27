# Reddit TypeScript SDK

A TypeScript SDK for interacting with the Reddit API, providing functionalities for user data retrieval, search operations (users, posts, communities), post and comment processing, moderation, and comprehensive data access.

## Installation

```bash
npm install @microfox/reddit
```

## Environment Variables

The following environment variables are used by this SDK:

- `REDDIT_CLIENT_ID`: Your Reddit application's client ID. (Required)
- `REDDIT_CLIENT_SECRET`: Your Reddit application's client secret. (Required)
- `REDDIT_ACCESS_TOKEN`: The access token for authenticating requests. (Required)
- `REDDIT_REFRESH_TOKEN`: The refresh token obtained during initial authorization. (Required)
- `SCOPES`: A comma-separated list of scopes defining the permissions requested. (Required)

## Additional Information

To use this SDK, you need to obtain OAuth credentials from Reddit. Follow these steps:

1. Go to https://www.reddit.com/prefs/apps

2. Click on 'create app' or 'create another app' at the bottom

3. Fill in the required information:

   - Name: Your app's name

   - App type: Choose 'web app' for most cases

   - Description: Brief description of your app

   - About URL: Your app's website (if applicable)

4. Click 'create app'

5. You'll receive a Client ID and Client Secret. Keep these secure.

Environment variables:

- REDDIT_CLIENT_ID: Your Reddit application's client ID

- REDDIT_CLIENT_SECRET: Your Reddit application's client secret

To set up environment variables:

1. Create a .env file in your project root (if not already present)

2. Add the following lines to the .env file:

   REDDIT_CLIENT_ID=your_client_id_here

   REDDIT_CLIENT_SECRET=your_client_secret_here

3. Use a package like dotenv to load these variables in your application

Important notes:

- Reddit's OAuth implementation uses comma-separated scopes instead of space-separated

- Access tokens expire after 1 hour (3600 seconds)

- To get a refresh token, include 'duration=permanent' in the initial authorization request

- Rate limits: https://github.com/reddit-archive/reddit/wiki/API#rules

  - 60 requests per minute

  - OAuth2 clients may make up to 600 requests per 10 minutes

  - Monitor the X-Ratelimit headers in API responses for current limits and usage

For more detailed information, refer to the Reddit API documentation: https://www.reddit.com/dev/api/oauth
