# LinkedIn Member Data Portability SDK

A TypeScript SDK for LinkedIn Member Data Portability.

## Installation

```bash
npm install @microfox/linkedin-member-data-portability
```

## Environment Variables

The following environment variables are used by this SDK:

- `LINKEDIN_CLIENT_ID`: Your LinkedIn app's Client ID. (Required)
- `LINKEDIN_CLIENT_SECRET`: Your LinkedIn app's Client Secret. (Required)
- `LINKEDIN_REDIRECT_URI`: The redirect URI registered in your LinkedIn app. (Required)
- `LINKEDIN_ACCESS_TOKEN`: The OAuth 2.0 access token for authenticated requests. (Required)
- `LINKEDIN_REFRESH_TOKEN`: The refresh token to obtain new access tokens. (Optional)
- `SCOPES`: The scopes for OAuth requests (Required)

## Additional Information

To use this SDK, you need to obtain LinkedIn API credentials. Follow these steps:

1. Go to the LinkedIn Developer Portal (https://developer.linkedin.com/) and sign in.

2. Create a new app or use an existing one.

3. In your app settings, find the 'Client ID' and 'Client Secret'. You'll need these for authentication.

4. Add a redirect URI to your app settings. This should match the redirectUri you provide when initializing the SDK.

5. Request the 'r_dma_portability_3rd_party' scope for your app to access the Data Portability APIs.

Environment Variables:

- LINKEDIN_CLIENT_ID: Your LinkedIn app's Client ID

- LINKEDIN_CLIENT_SECRET: Your LinkedIn app's Client Secret

- LINKEDIN_REDIRECT_URI: The redirect URI registered in your LinkedIn app

- LINKEDIN_ACCESS_TOKEN: The OAuth 2.0 access token for authenticated requests

- LINKEDIN_REFRESH_TOKEN: The refresh token to obtain new access tokens (optional)

Authentication:

This SDK uses OAuth 2.0 for authentication. You need to implement the OAuth flow in your application to obtain an access token. The @microfox/linkedin-oauth package is used to handle OAuth-related operations.

Rate Limits:

LinkedIn API has rate limits, but specific details are not provided in the documentation. Implement proper error handling and retry mechanisms in your application to handle rate limiting errors.

Important Notes:

- Always use HTTPS for all API endpoints and OAuth flows.

- Keep your Client Secret and access tokens secure. Never expose them in client-side code.

- The Member Changelog API is limited to events from the last 28 days.

- Include the 'LinkedIn-Version: 202312' header in all API requests (handled automatically by the SDK).

- The SDK automatically validates the access token before each request. If it's invalid, you'll need to refresh it or obtain a new one.

- For pagination in the Member Snapshot API, use the 'start' parameter (not implemented in this SDK version).

Usage Example:

```typescript
import { createLinkedInSDK, LinkedInScope } from './LinkedInDataPortabilitySDK';

const sdk = createLinkedInSDK({
  clientId: process.env.LINKEDIN_CLIENT_ID!,

  clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,

  redirectUri: process.env.LINKEDIN_REDIRECT_URI!,

  accessToken: process.env.LINKEDIN_ACCESS_TOKEN!,

  refreshToken: process.env.LINKEDIN_REFRESH_TOKEN,
});

// Example: Get member change logs

const changeLogs = await sdk.getMemberChangeLogs();

console.log(changeLogs);
```

For more detailed information about the LinkedIn DMA Data Portability APIs, refer to the official LinkedIn Developer documentation.

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [LinkedInDataPortabilitySDK](./docs/LinkedInDataPortabilitySDK.md)
- [validateAccessToken](./docs/validateAccessToken.md)
- [refreshAccessToken](./docs/refreshAccessToken.md)
- [getMemberChangeLogs](./docs/getMemberChangeLogs.md)
- [getMemberSnapshotData](./docs/getMemberSnapshotData.md)
- [getMemberAuthorizations](./docs/getMemberAuthorizations.md)
- [triggerMemberDataProcessing](./docs/triggerMemberDataProcessing.md)
