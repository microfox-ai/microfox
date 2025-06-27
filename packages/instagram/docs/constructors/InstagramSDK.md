## Constructor: `InstagramSDK`

Initializes a new instance of the InstagramSDK.

**Parameters:**

- `config`: object - Configuration options for the SDK.
  - `accessToken`: string - The user's access token.
  - `refreshToken`: string - The user's refresh token.
  - `clientId`: string - The app's client ID.
  - `clientSecret`: string - The app's client secret.
  - `redirectUri`: string - The redirect URI for OAuth.

**Return Value:**

- `InstagramSDK` - A new instance of the InstagramSDK.

**Examples:**

```typescript
// Example: Initialize SDK with configuration
const instagramSDK = createInstagramSDK({
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
  refreshToken: process.env.INSTAGRAM_REFRESH_TOKEN,
  clientId: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  redirectUri: process.env.INSTAGRAM_REDIRECT_URI,
});
```
