# Microfox Instagram SDK

A TypeScript SDK for interacting with the Instagram Graph API using OAuth 2.0.

## Installation

```bash
npm install @microfox/instagram
```

### Required Environment Variables:

- `INSTAGRAM_CLIENT_ID`: Your Instagram app's Client ID. Obtain this from your app's settings on the Facebook Developer platform. (Required)
- `INSTAGRAM_CLIENT_SECRET`: Your Instagram app's Client Secret. Obtain this from your app's settings on the Facebook Developer platform. Keep this value secure. (Required)
- `INSTAGRAM_REDIRECT_URI`: The OAuth redirect URI configured for your app on the Facebook Developer platform. This URI must match the one used during the OAuth flow. (Required)
- `INSTAGRAM_ACCESS_TOKEN`: The user's long-lived access token obtained through the OAuth flow. This token is valid for 60 days and is used to authenticate API requests. (Required)


## Additional Information

To use this SDK, you need to obtain Instagram API credentials. Follow these steps:

1. Create a Facebook Developer account at https://developers.facebook.com/

2. Create a new app or use an existing one

3. Add the Instagram Graph API product to your app

4. Set up Instagram Basic Display or Instagram Graph API

5. Configure your app settings, including the valid OAuth redirect URIs

6. Obtain your app's Client ID and Client Secret from the app dashboard

Environment variables:

- INSTAGRAM_CLIENT_ID: Your Instagram app's Client ID

- INSTAGRAM_CLIENT_SECRET: Your Instagram app's Client Secret

- INSTAGRAM_REDIRECT_URI: The OAuth redirect URI for your app

- INSTAGRAM_ACCESS_TOKEN: The user's long-lived access token (obtained through OAuth flow, valid for 60 days)

Authentication:

This SDK uses OAuth 2.0 for authentication. You need to implement the OAuth flow in your application to obtain the long-lived access token. The SDK automatically converts short-lived tokens to long-lived tokens (valid for 60 days).

Rate Limits:

Instagram API has rate limits that vary by endpoint. Monitor your usage and implement appropriate error handling and backoff strategies. Use the getContentPublishingLimit method to check your current rate limit status for content publishing.

Important Notes:

- Always use HTTPS for API calls and redirect URIs

- Keep your Client Secret and access tokens secure

- Implement proper error handling in your application

- Some endpoints require specific permissions. Ensure your app has the necessary permissions enabled

- For video uploads, use the resumable upload process for better reliability

- When working with insights, be aware of the different metrics available for media objects vs. user accounts

- The oEmbed endpoint requires a separate app access token or client access token

For more detailed information, refer to the official Instagram Graph API documentation: https://developers.facebook.com/docs/instagram-api/

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [InstagramSDK](./docs/InstagramSDK.md)
- [createMediaContainer](./docs/createMediaContainer.md)
- [getMediaContainerStatus](./docs/getMediaContainerStatus.md)
- [publishMedia](./docs/publishMedia.md)
- [getContentPublishingLimit](./docs/getContentPublishingLimit.md)
- [uploadVideo](./docs/uploadVideo.md)
- [getComments](./docs/getComments.md)
- [replyToComment](./docs/replyToComment.md)
- [hideComment](./docs/hideComment.md)
- [toggleComments](./docs/toggleComments.md)
- [deleteComment](./docs/deleteComment.md)
- [sendPrivateReply](./docs/sendPrivateReply.md)
- [getMediaInsights](./docs/getMediaInsights.md)
- [getAccountInsights](./docs/getAccountInsights.md)
- [getOEmbedData](./docs/getOEmbedData.md)
