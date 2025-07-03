## Constructor: `GoogleSearchConsoleSDK`

Initializes a new instance of the Google Search Console SDK.

**Parameters:**

- `options`: `GoogleSearchConsoleSDKOptions` (required)

  - An object containing the necessary options for configuring the SDK.

  **`GoogleSearchConsoleSDKOptions` Type:**

  ```typescript
  interface GoogleSearchConsoleSDKOptions {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    accessToken: string;
  }
  ```

  - `clientId`: `string` (required)
    - Your Google OAuth 2.0 client ID.
    - Obtain this value from the Google Cloud Console.
  - `clientSecret`: `string` (required)
    - Your Google OAuth 2.0 client secret.
    - Obtain this value from the Google Cloud Console.
  - `redirectUri`: `string` (required)
    - The redirect URI you specified in your Google Cloud Console.
  - `accessToken`: `string` (required)
    - Your Google OAuth 2.0 access token.
    - Obtain this value through the OAuth 2.0 flow.

**Examples:**

```typescript
// Example using environment variables
const sdk = new GoogleSearchConsoleSDK({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  accessToken: process.env.GOOGLE_ACCESS_TOKEN,
});
```
