# Instagram SDK

A TypeScript SDK for interacting with the Instagram API using OAuth 2.0. This package simplifies authentication and data access.

## Installation

```bash
npm install @microfox/instagramfb
```

## Environment Variables

The following environment variables are used by this SDK:

- `INSTAGRAM_CLIENT_ID`: Your Facebook App ID. Obtain this from your Facebook Developer account. (Required)
- `INSTAGRAM_CLIENT_SECRET`: Your Facebook App Secret. Obtain this from your Facebook Developer account. (Required)
- `INSTAGRAM_REDIRECT_URI`: Your OAuth callback URL. This is the URL where Facebook will redirect the user after authorization. (Required)
- `INSTAGRAM_ACCESS_TOKEN`: A valid access token for the Instagram Graph API. Obtain this through the OAuth flow. (Required)

## Additional Information

To use this SDK, you need to set up a Facebook Developer account and create an app that uses the Instagram Graph API.

Visit https://developers.facebook.com/ to create your app and obtain the necessary credentials.

Required environment variables:

- INSTAGRAM_CLIENT_ID: Your Facebook App ID

- INSTAGRAM_CLIENT_SECRET: Your Facebook App Secret

- INSTAGRAM_REDIRECT_URI: Your OAuth callback URL

- INSTAGRAM_ACCESS_TOKEN: A valid access token for the Instagram Graph API

Make sure to configure the correct permissions and features for your app in the Facebook Developer Console.

This SDK uses OAuth 2.0 for authentication. You need to implement the full OAuth flow in your application to obtain a valid access token.

Rate limits: The API has various rate limits depending on the endpoint. Notable limits include:

- Content Publishing: 50 posts within a 24-hour moving period

- oEmbed: Up to 5 million requests per 24 hours for app tokens, significantly lower for client tokens

Ensure your application respects these rate limits to avoid being blocked by the API.

For more detailed information about the Instagram Graph API, visit: https://developers.facebook.com/docs/instagram-api/

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [InstagramSDK](./docs/InstagramSDK.md)
- [validateAccessToken](./docs/validateAccessToken.md)
- [createMediaContainer](./docs/createMediaContainer.md)
- [publishMedia](./docs/publishMedia.md)
- [checkMediaStatus](./docs/checkMediaStatus.md)
- [getContentPublishingLimit](./docs/getContentPublishingLimit.md)
- [uploadVideo](./docs/uploadVideo.md)
- [getComments](./docs/getComments.md)
- [replyToComment](./docs/replyToComment.md)
- [hideComment](./docs/hideComment.md)
- [enableDisableComments](./docs/enableDisableComments.md)
- [deleteComment](./docs/deleteComment.md)
- [sendPrivateReply](./docs/sendPrivateReply.md)
- [getMediaInsights](./docs/getMediaInsights.md)
- [getAccountInsights](./docs/getAccountInsights.md)
- [getOEmbed](./docs/getOEmbed.md)
