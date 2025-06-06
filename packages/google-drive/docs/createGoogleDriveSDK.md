## Function: `createGoogleDriveSDK`

A factory function that creates and initializes an instance of the `GoogleDriveSdk`. This function simplifies the setup process by encapsulating the instantiation of the SDK client.

**Purpose:**
To provide a convenient way to instantiate the `GoogleDriveSdk` with the necessary configuration options. It's the primary entry point for using the SDK.

**Parameters:**
- `options`: `GoogleDriveSDKOptions` (object, required) - Configuration options for the SDK. This object should conform to the `GoogleDriveSDKOptions` interface.
    - `clientId`: `string` (required) - The Client ID obtained from the Google Cloud Console for your OAuth 2.0 application. This ID is used to identify your application to Google's authentication servers. You can set this using the `GOOGLE_CLIENT_ID` environment variable.
    - `clientSecret`: `string` (required) - The Client Secret obtained from the Google Cloud Console for your OAuth 2.0 application. This secret is used to authenticate your application to Google's authentication servers and must be kept confidential. You can set this using the `GOOGLE_CLIENT_SECRET` environment variable.
    - `redirectUri`: `string` (required) - The Redirect URI configured in your Google Cloud Console for your OAuth 2.0 application. This is the URI where Google will redirect the user after they have successfully authenticated and authorized your application. You can set this using the `GOOGLE_REDIRECT_URI` environment variable.
    - `scopes`: `array<string>` (required) - A list of OAuth 2.0 scopes required for Google Drive API access. These scopes define the permissions your application is requesting (e.g., `['https://www.googleapis.com/auth/drive']`). You can set this using a space-separated list in the `GOOGLE_DRIVE_SCOPES` environment variable.
    - `accessToken`: `string` (optional) - An optional pre-existing OAuth 2.0 access token for Google Drive API. If provided, the SDK will use this token for API requests. It's typically short-lived. You can set this using the `GOOGLE_DRIVE_ACCESS_TOKEN` environment variable.
    - `refreshToken`: `string` (optional) - An optional OAuth 2.0 refresh token for Google Drive API. This token can be used to obtain new access tokens when the current one expires. It's typically long-lived and should be stored securely. You can set this using the `GOOGLE_DRIVE_REFRESH_TOKEN` environment variable.

**Return Value:**
- Type: `GoogleDriveSdk` (object)
- Description: An instance of the `GoogleDriveSdk` class, ready to interact with the Google Drive API.

**Examples:**
```typescript
// Example 1: Minimal usage with required options
const sdk = createGoogleDriveSDK({
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  redirectUri: 'YOUR_GOOGLE_REDIRECT_URI',
  scopes: ['https://www.googleapis.com/auth/drive']
});

// Example 2: Usage with optional access and refresh tokens
const sdkWithTokens = createGoogleDriveSDK({
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  redirectUri: 'YOUR_GOOGLE_REDIRECT_URI',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  accessToken: 'PRE_EXISTING_ACCESS_TOKEN',
  refreshToken: 'PRE_EXISTING_REFRESH_TOKEN'
});

// Example 3: Using environment variables (conceptual)
// Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, 
// and GOOGLE_DRIVE_SCOPES (e.g., "https://www.googleapis.com/auth/drive") are set.
// const sdkFromEnv = createGoogleDriveSDK({
//   clientId: process.env.GOOGLE_CLIENT_ID!,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//   redirectUri: process.env.GOOGLE_REDIRECT_URI!,
//   scopes: process.env.GOOGLE_DRIVE_SCOPES!.split(' '),
//   accessToken: process.env.GOOGLE_DRIVE_ACCESS_TOKEN,
//   refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
// });
```
