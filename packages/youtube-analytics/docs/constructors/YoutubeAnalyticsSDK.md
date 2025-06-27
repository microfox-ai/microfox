## Constructor: `YoutubeAnalyticsSDK`

Initializes a new instance of the YoutubeAnalyticsSDK.

**Parameters:**

- `config` (object, required): Configuration options for the SDK.
  - `accessToken` (string, required): The initial access token for authenticating with the YouTube Analytics API.  This should be a valid OAuth 2.0 access token.
  - `refreshToken` (string, optional): The refresh token used to obtain a new access token when the current one expires. This should be a valid OAuth 2.0 refresh token.
  - `clientId` (string, required): The client ID of your OAuth 2.0 credentials. This should be a valid client ID obtained from the Google Cloud Console.
  - `clientSecret` (string, required): The client secret of your OAuth 2.0 credentials. This should be a valid client secret obtained from the Google Cloud Console.
  - `redirectUri` (string, required): The redirect URI configured for your OAuth 2.0 credentials. This should match the redirect URI set in the Google Cloud Console.

**Examples:**

```typescript
// Example 1: Initialization with access token and refresh token
const sdk = new YoutubeAnalyticsSDK({
  accessToken: process.env.GOOGLE_ACCESS_TOKEN,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

// Example 2: Initialization with only access token
const sdk = new YoutubeAnalyticsSDK({
  accessToken: process.env.GOOGLE_ACCESS_TOKEN,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});
```