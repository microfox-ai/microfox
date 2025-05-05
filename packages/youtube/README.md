# YouTube SDK

A TypeScript SDK for interacting with the YouTube API.

## Installation

```bash
npm install @microfox/youtube @microfox/google-oauth
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `GOOGLE_CLIENT_ID`: The OAuth 2.0 Client ID for authenticating with Google. ** (Required)**
- `GOOGLE_CLIENT_SECRET`: The OAuth 2.0 Client Secret for authenticating with Google. ** (Required)**
- `GOOGLE_REDIRECT_URI`: The OAuth 2.0 Redirect URI for handling the authentication redirect. ** (Required)**
- `GOOGLE_ACCESS_TOKEN`: The OAuth 2.0 Access Token for authenticating requests to the YouTube Data API. ** (Required)**
- `GOOGLE_REFRESH_TOKEN`: The OAuth 2.0 Refresh Token for refreshing the access token when it expires. ** (Required)**
- `SCOPES`: The list of scopes to request during the OAuth 2.0 flow. ** (Required)**

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**YouTubeSDK** (Constructor)](./docs/YouTubeSDK.md): Initializes the client.
- [validateAccessToken](./docs/validateAccessToken.md)
- [refreshAccessToken](./docs/refreshAccessToken.md)
- [listActivities](./docs/listActivities.md)
- [listCaptions](./docs/listCaptions.md)

