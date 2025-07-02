## Constructor: `LinkedInDataPortabilitySDK`

Initializes a new instance of the LinkedInDataPortabilitySDK.

**Parameters:**

- `config` (object, required): Configuration options for the SDK.
  - `clientId` (string, required): Your LinkedIn app's Client ID.
  - `clientSecret` (string, required): Your LinkedIn app's Client Secret.
  - `redirectUri` (string, required): The redirect URI registered in your LinkedIn app.
  - `accessToken` (string, required): The OAuth 2.0 access token for authenticated requests.
  - `refreshToken` (string, optional): The refresh token to obtain new access tokens.

**Return Value:**

- `LinkedInDataPortabilitySDK`: An instance of the LinkedInDataPortabilitySDK.

**Examples:**

```typescript
// Example: Initialize the SDK
const sdk = new LinkedInDataPortabilitySDK({
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  redirectUri: process.env.LINKEDIN_REDIRECT_URI,
  accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
  refreshToken: process.env.LINKEDIN_REFRESH_TOKEN,
});
```
