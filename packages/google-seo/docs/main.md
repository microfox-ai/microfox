# Google Search Console

A TypeScript SDK for interacting with the Google Search Console API.

## Installation

```bash
npm install @microfox/google-seo
```

## Environment Variables

The following environment variables are used by this SDK:

- `GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 client ID. Obtain this value from the Google Cloud Console. (Required)
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth 2.0 client secret. Obtain this value from the Google Cloud Console. (Required)
- `GOOGLE_REDIRECT_URI`: The redirect URI you specified in your Google Cloud Console. (Required)
- `GOOGLE_ACCESS_TOKEN`: Your Google OAuth 2.0 access token. Obtain this value through the OAuth 2.0 flow. (Required)

## Additional Information

To use this SDK, you need to obtain Google OAuth 2.0 credentials (client ID and client secret) from the Google Cloud Console (https://console.cloud.google.com/).

Enable the Google Search Console API in your Google Cloud project.

Set up the following environment variables:

- GOOGLE_CLIENT_ID: Your Google OAuth 2.0 client ID

- GOOGLE_CLIENT_SECRET: Your Google OAuth 2.0 client secret

- GOOGLE_REDIRECT_URI: The redirect URI you specified in your Google Cloud Console

- GOOGLE_ACCESS_TOKEN: Your Google OAuth 2.0 access token

To obtain an access token, you need to go through the OAuth 2.0 flow. You can use the @microfox/google-oauth package to handle this process.

This SDK requires the following OAuth 2.0 scopes: https://www.googleapis.com/auth/webmasters and https://www.googleapis.com/auth/webmasters.readonly

Make sure to handle token refresh when the access token expires. You can use the refreshAccessToken method provided by the SDK.

The Google Search Console API has usage quotas and limits. Please refer to the official documentation for the most up-to-date information on rate limits: https://developers.google.com/webmaster-tools/search-console-api-original/v3/limits

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [GoogleSearchConsoleSDK](./docs/GoogleSearchConsoleSDK.md)
- [validateAccessToken](./docs/validateAccessToken.md)
- [refreshAccessToken](./docs/refreshAccessToken.md)
- [listSites](./docs/listSites.md)
- [getSite](./docs/getSite.md)
- [addSite](./docs/addSite.md)
- [deleteSite](./docs/deleteSite.md)
- [listSitemaps](./docs/listSitemaps.md)
- [getSitemap](./docs/getSitemap.md)
- [submitSitemap](./docs/submitSitemap.md)
- [deleteSitemap](./docs/deleteSitemap.md)
- [querySearchAnalytics](./docs/querySearchAnalytics.md)
- [inspectUrl](./docs/inspectUrl.md)
