## Function: `createGoogleDriveSDK`

This function serves as a factory to create and initialize a new instance of the `GoogleDriveSdk`. It simplifies the instantiation process of the SDK.

**Purpose:**
To provide a convenient way to get an instance of `GoogleDriveSdk` configured with the necessary Google OAuth 2.0 credentials and optional initial tokens.

**Parameters:**

-   `options` (GoogleDriveSDKOptions): Required. An object containing the configuration options for the SDK.
    -   `clientId` (string): Required. The Google OAuth 2.0 client ID obtained from the Google Cloud Console. This ID is used to identify your application.
    -   `clientSecret` (string): Required. The Google OAuth 2.0 client secret obtained from the Google Cloud Console. This secret is used to authenticate your application.
    -   `redirectUri` (string): Required. The authorized redirect URI for your application, as configured in the Google Cloud Console. This URI is where Google redirects the user after they authorize your application. Must be a valid URL.
    -   `accessToken` (string): Optional. An existing OAuth 2.0 access token. If provided, the SDK will use this token for API calls until it expires.
    -   `refreshToken` (string): Optional. An existing OAuth 2.0 refresh token. If provided, the SDK can use this token to obtain new access tokens when the current one expires.
    -   `scopes` (array<string>): Optional. An array of strings representing the OAuth 2.0 scopes your application requires. These scopes define the permissions your application has to access Google Drive resources. Examples include `'https://www.googleapis.com/auth/drive.readonly'`, `'https://www.googleapis.com/auth/drive.file'`.

**Return Value:**

-   Type: `GoogleDriveSdk`
-   Description: Returns a new instance of the `GoogleDriveSdk`, configured with the provided options.

**Type Definitions:**

*   `GoogleDriveSDKOptions`:
    ```typescript
    type GoogleDriveSDKOptions = {
      clientId: string; // Google OAuth 2.0 client ID
      clientSecret: string; // Google OAuth 2.0 client secret
      redirectUri: string; // Authorized redirect URI (must be a URL)
      accessToken?: string; // Optional OAuth 2.0 access token
      refreshToken?: string; // Optional OAuth 2.0 refresh token
      scopes?: string[]; // Optional array of OAuth 2.0 scopes
    };
    ```

**Examples:**

To use the Google Drive SDK, you need to set up OAuth 2.0 credentials:

1.  Go to the Google Cloud Console (https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Enable the Google Drive API for your project.
4.  Create OAuth 2.0 credentials (OAuth client ID) for a Web application.
5.  Set the authorized redirect URIs for your application.

Once you have your credentials, you can use them to initialize the SDK:

```typescript
// Example 1: Basic initialization with required options
import { createGoogleDriveSDK } from '@microfox/google-drive';

const sdkMinimal = createGoogleDriveSDK({
  clientId: 'YOUR_GOOGLE_CLIENT_ID',       // Replace with your actual client ID
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET', // Replace with your actual client secret
  redirectUri: 'YOUR_GOOGLE_REDIRECT_URI'    // Replace with your actual redirect URI
});

// Example 2: Initialization with all options, including pre-existing tokens and scopes
const sdkFull = createGoogleDriveSDK({
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  redirectUri: 'YOUR_GOOGLE_REDIRECT_URI',
  accessToken: 'PRE_EXISTING_ACCESS_TOKEN',  // Optional: if you already have an access token
  refreshToken: 'PRE_EXISTING_REFRESH_TOKEN', // Optional: if you already have a refresh token
  scopes: [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.file'
  ]
});

// Example 3: Using environment variables (conceptual, actual implementation might vary)
// Ensure these environment variables are set in your Node.js environment
const sdkFromEnv = createGoogleDriveSDK({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  accessToken: process.env.GOOGLE_ACCESS_TOKEN,  // Optional
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Optional
  scopes: ['https://www.googleapis.com/auth/drive']
});
```
