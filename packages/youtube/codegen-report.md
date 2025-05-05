# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/YouTubeSdk.ts | 7033 |
| src/types/index.ts | 4239 |
| src/schemas/index.ts | 6500 |
| src/index.ts | 129 |

## Setup Information
- **Auth Type**: oauth2
- **Auth SDK**: @microfox/google-oauth
- **OAuth2 Scopes**: https://www.googleapis.com/auth/youtube, https://www.googleapis.com/auth/youtube.force-ssl, https://www.googleapis.com/auth/youtube.upload, https://www.googleapis.com/auth/youtubepartner
- **Setup Info**: To use the YouTube SDK, you need to set up a Google Cloud project and obtain OAuth 2.0 credentials:

1. Go to the Google Cloud Console (https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the YouTube Data API v3 for your project.
4. Go to the "Credentials" section and create an OAuth 2.0 Client ID.
5. Set the authorized redirect URIs for your application.
6. Note down the Client ID and Client Secret.

Environment variables:
- GOOGLE_CLIENT_ID: Your OAuth 2.0 Client ID
- GOOGLE_CLIENT_SECRET: Your OAuth 2.0 Client Secret
- GOOGLE_REDIRECT_URI: Your authorized redirect URI

To use the SDK, you'll need to implement the OAuth 2.0 flow to obtain an access token and refresh token. The SDK provides methods to help with this process.

Example usage:

```typescript
import { createYouTubeSDK } from '@microfox/youtube';

const youtube = createYouTubeSDK({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  accessToken: 'YOUR_ACCESS_TOKEN',
  refreshToken: 'YOUR_REFRESH_TOKEN',
});

// Now you can use the YouTube SDK methods
const videos = await youtube.listVideos({ part: ['snippet'], chart: 'mostPopular' });
```

Make sure to handle token refresh and error cases in your application.



---
**Total Usage:** Total Bytes: 17901 | Tokens: 457073 | Cost: $1.8282