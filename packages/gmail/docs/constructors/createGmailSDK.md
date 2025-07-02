The GmailSDK constructor initializes a new instance of the SDK for interacting with the Gmail API.

It takes a GmailSDKConfig object as a parameter, which configures the OAuth 2.0 settings and the user ID.

**Parameters:**

- `config`: GmailSDKConfig object with the following properties:
  - `accessToken`: The access token after the oauth authentication
  - `refreshToken`: The refresh token after the oauth authentication
  - `clientId`: The client ID for the Google OAuth application.
  - `clientSecret`: The client secret for the Google OAuth application.
  - `redirectUri`: The redirect URI for the Google OAuth flow.
  - `userId` (optional): The user ID to use for API requests. Defaults to 'me'.

**Usage Example:**

```typescript
import { createGmailSDK } from 'gmail';

const gmailSdk = createGmailSDK({
  accessToken: process.env.GOOGLE_ACCESS_TOKEN!,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
});
```

**Authentication:**

This SDK uses OAuth 2.0 for authentication. You need to set up a Google Cloud project, enable the Gmail API, and create OAuth 2.0 credentials. See the extra information for detailed instructions.

**Error Handling:**

The constructor will throw an error if the provided configuration is invalid. The SDK functions will throw errors if there are issues with the API requests or authentication.
