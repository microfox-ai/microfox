# Microfox Slack OAuth

A TypeScript OAuth package for Slack.

## Installation

```bash
npm install @microfox/slack-oauth @microfox/slack-oauth
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `SLACK_CLIENT_ID`: Your Slack app's Client ID. ** (Required)**
- `SLACK_CLIENT_SECRET`: Your Slack app's Client Secret. ** (Required)**
- `SLACK_REDIRECT_URI`: The redirect URI you configured for your Slack app. ** (Required)**
- `SCOPES`: The scopes for your Slack app. ** (Required)**
- `USER_SCOPES`: The user scopes for your slack app.

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**SlackOAuthSdk** (Constructor)](./docs/SlackOAuthSdk.md): Initializes the client.
- [getAuthorizationUrl](./docs/getAuthorizationUrl.md)
- [exchangeCodeForToken](./docs/exchangeCodeForToken.md)
- [validateToken](./docs/validateToken.md)
- [revokeToken](./docs/revokeToken.md)
