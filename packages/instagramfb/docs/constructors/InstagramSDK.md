## Constructor: `InstagramSDK`

Initializes a new instance of the InstagramSDK.

**Parameters:**

- `config` (object, required): Configuration options for the SDK.
  - `clientId` (string, required): Your Facebook App ID.
  - `clientSecret` (string, required): Your Facebook App Secret.
  - `redirectUri` (string, required): Your OAuth callback URL.
  - `accessToken` (string, required): A valid access token for the Instagram Graph API.
  - `apiVersion` (string, optional): The API version to use. Defaults to 'v22.0'.

**Examples:**

```typescript
// Example using environment variables
const sdk = new InstagramSDK({
  clientId: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  redirectUri: process.env.INSTAGRAM_REDIRECT_URI,
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
});

// Example with specific API version
const sdk = new InstagramSDK({
  clientId: '<clientId>',
  clientSecret: '<clientSecret>',
  redirectUri: '<redirectUri>',
  accessToken: '<accessToken>',
  apiVersion: 'v14.0',
});
```
