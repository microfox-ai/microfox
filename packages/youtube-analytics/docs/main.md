# Youtube Analytics SDK

A TypeScript SDK for interacting with the YouTube Analytics API.

## Installation

```bash
npm install @microfox/youtube-analytics @microfox/google-oauth
```

## Environment Variables

The following environment variables are used by this SDK:

- `GOOGLE_ACCESS_TOKEN`: The access token for authenticating with the YouTube Analytics API. (Required)
- `GOOGLE_REFRESH_TOKEN`: The refresh token used to obtain a new access token when the current one expires. (Optional)
- `GOOGLE_CLIENT_ID`: The client ID of your OAuth 2.0 credentials. (Required)
- `GOOGLE_CLIENT_SECRET`: The client secret of your OAuth 2.0 credentials. (Required)
- `GOOGLE_REDIRECT_URI`: The redirect URI configured for your OAuth 2.0 credentials. (Required)
- `SCOPES`: The scopes required by the SDK (Required)

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [YoutubeAnalyticsSDK](./docs/YoutubeAnalyticsSDK.md)
- [getReports](./docs/getReports.md)
- [listGroups](./docs/listGroups.md)
- [insertGroup](./docs/insertGroup.md)
- [updateGroup](./docs/updateGroup.md)
- [deleteGroup](./docs/deleteGroup.md)
- [listGroupItems](./docs/listGroupItems.md)
- [insertGroupItem](./docs/insertGroupItem.md)
- [deleteGroupItem](./docs/deleteGroupItem.md)
- [refreshAccessToken](./docs/refreshAccessToken.md)
- [validateAccessToken](./docs/validateAccessToken.md)
