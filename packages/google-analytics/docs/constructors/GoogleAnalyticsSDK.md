## Constructor: `GoogleAnalyticsSDK`

Initializes a new instance of the Google Analytics SDK.

**Parameters:**

- `config`: object - Configuration options for the SDK.
  - `clientId`: string - Your Google Cloud project's client ID.
  - `clientSecret`: string - Your Google Cloud project's client secret.
  - `redirectUri`: string - Your OAuth redirect URI.
  - `accessToken`: string - Your Google Analytics access token.

**Return Value:**

- `GoogleAnalyticsSDK` - An instance of the Google Analytics SDK.

**Examples:**

```typescript
// Example: Initialize SDK with configuration
const sdk = new GoogleAnalyticsSDK({
  clientId: process.env.GOOGLE_ANALYTICS_CLIENT_ID,
  clientSecret: process.env.GOOGLE_ANALYTICS_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_ANALYTICS_REDIRECT_URI,
  accessToken: process.env.GOOGLE_ANALYTICS_ACCESS_TOKEN,
});
```
