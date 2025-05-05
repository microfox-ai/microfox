## Constructor: `YouTubeSDK`

Initializes a new instance of the YouTubeSDK class.

**Purpose:**
The constructor sets up the YouTube SDK with the necessary credentials and configuration for interacting with the YouTube Data API v3.

**Parameters:**

* `options`: An object containing the following required properties:
    * `clientId`: `string` (required). The OAuth 2.0 client ID.
    * `clientSecret`: `string` (required). The OAuth 2.0 client secret.
    * `redirectUri`: `string` (required). The OAuth 2.0 redirect URI.
    * `accessToken`: `string` (required). The OAuth 2.0 access token.
    * `refreshToken`: `string` (required). The OAuth 2.0 refresh token.

**Return Value:**

* `YouTubeSDK`: A new instance of the YouTubeSDK class.

**Examples:**

```typescript
const youtube = new YouTubeSDK({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  accessToken: process.env.GOOGLE_ACCESS_TOKEN!,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN!
});
```