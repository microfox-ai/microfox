## Constructor: `YouTubeReportingAPISDK`

Initializes a new instance of the `YouTubeReportingAPISDK`.

**Parameters:**

- `config`: `YouTubeReportingAPIConfig` - An object containing the configuration options for the SDK.
  - `clientId`: `string` - The client ID for the Google OAuth 2.0 credentials. This is a required field and should be a non-empty string.
  - `clientSecret`: `string` - The client secret for the Google OAuth 2.0 credentials. This is a required field and should be a non-empty string.
  - `redirectUri`: `string` - The redirect URI for the Google OAuth 2.0 flow. This is a required field and should be a valid URL string.
  - `accessToken`: `string` (optional) - The access token for authenticated requests. If provided, the SDK will use this access token for API calls.
  - `refreshToken`: `string` (optional) - The refresh token to obtain new access tokens. If provided, the SDK will automatically refresh the access token when it expires.

**Examples:**

```typescript
// Example 1: Minimal usage with required arguments
const sdk = new YouTubeReportingAPISDK({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!
});

// Example 2: Full usage with all optional arguments
const sdk = new YouTubeReportingAPISDK({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  accessToken: process.env.GOOGLE_ACCESS_TOKEN,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN
});
```