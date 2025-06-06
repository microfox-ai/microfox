## Constructor: `GoogleDriveSdk`

The `GoogleDriveSdk` constructor initializes a new instance of the SDK, enabling interaction with the Google Drive API. It configures the OAuth 2.0 authentication mechanism required for all API requests. The constructor accepts client credentials and, optionally, pre-existing access and refresh tokens.

**Purpose:**
To set up and configure the Google Drive SDK with the necessary authentication details, allowing it to manage Google Drive resources such as drives, apps, and access proposals.

**Parameters:**

- `options: GoogleDriveSDKOptions` (required): An object containing the configuration options for the SDK.
  - `clientId: string` (required): The Client ID obtained from the Google Cloud Console for your OAuth 2.0 application. This ID is used to identify your application to Google's authentication servers. It can also be provided via the `GOOGLE_CLIENT_ID` environment variable.
  - `clientSecret: string` (required): The Client Secret obtained from the Google Cloud Console for your OAuth 2.0 application. This secret is used to authenticate your application to Google's authentication servers and must be kept confidential. It can also be provided via the `GOOGLE_CLIENT_SECRET` environment variable.
  - `redirectUri: string` (required): The Redirect URI configured in your Google Cloud Console for your OAuth 2.0 application. This is the URI where Google will redirect the user after they have successfully authenticated and authorized your application. It can also be provided via the `GOOGLE_REDIRECT_URI` environment variable.
  - `scopes: array<string>` (required): An array of OAuth 2.0 scope strings that define the permissions your application is requesting for Google Drive API access. For example, `['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']`. It can also be provided via the `GOOGLE_DRIVE_SCOPES` environment variable (as a space-separated string).
  - `accessToken?: string` (optional): An optional pre-existing OAuth 2.0 access token for the Google Drive API. If provided, the SDK will use this token for API requests. It is typically short-lived. It can also be provided via the `GOOGLE_DRIVE_ACCESS_TOKEN` environment variable.
  - `refreshToken?: string` (optional): An optional OAuth 2.0 refresh token for the Google Drive API. This token can be used to obtain new access tokens when the current one expires. It is typically long-lived and should be stored securely. It can also be provided via the `GOOGLE_DRIVE_REFRESH_TOKEN` environment variable.

**`GoogleDriveSDKOptions` Structure:**

```typescript
interface GoogleDriveSDKOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  accessToken?: string;
  refreshToken?: string;
}
```

**Examples:**

```typescript
// Example 1: Initialization using environment variables (conceptual)
const driveSdk = new GoogleDriveSdk({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  scopes: process.env.GOOGLE_DRIVE_SCOPES.split(' '),
  accessToken: process.env.GOOGLE_DRIVE_ACCESS_TOKEN,
  refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
});

// Example 2: Initialization with all options, including existing tokens
const driveSdkFull = new GoogleDriveSdk({
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  redirectUri: 'YOUR_GOOGLE_REDIRECT_URI',
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
  ],
  accessToken: 'PRE_EXISTING_ACCESS_TOKEN',
  refreshToken: 'PRE_EXISTING_REFRESH_TOKEN',
});
```
