# Google Drive SDK

A TypeScript SDK for interacting with the Google Drive API.

## Installation

```bash
npm install @microfox/google-drive @microfox/google-oauth
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `GOOGLE_DRIVE_CLIENT_ID`: Client ID for your Google Cloud project OAuth 2.0 credentials. Obtain this from the Google Cloud Console. ** (Required)**
- `GOOGLE_DRIVE_CLIENT_SECRET`: Client Secret for your Google Cloud project OAuth 2.0 credentials. Obtain this from the Google Cloud Console. ** (Required)**
- `GOOGLE_DRIVE_REDIRECT_URI`: The redirect URI registered in your Google Cloud project for the OAuth 2.0 client. This URI is where Google will redirect the user after they authorize the application. ** (Required)**
- `GOOGLE_DRIVE_SCOPES`: A space-separated string of OAuth 2.0 scopes required for Google Drive API access. These scopes define the permissions your application requests. For example: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly'. The SDK expects this as an array of strings, so your application will need to split this environment variable. ** (Required)**
- `GOOGLE_DRIVE_ACCESS_TOKEN`: Optional. An OAuth 2.0 access token for Google Drive API. If not provided, the SDK may attempt to use a refresh token or require an OAuth flow. (Optional)
- `GOOGLE_DRIVE_REFRESH_TOKEN`: Optional. An OAuth 2.0 refresh token for Google Drive API. Used to obtain new access tokens without requiring user re-authentication. (Optional)

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**GoogleDriveSdk** (Constructor)](./docs/GoogleDriveSdk.md): Initializes the client.
- [createGoogleDriveSDK](./docs/createGoogleDriveSDK.md)
- [deleteDrive](./docs/deleteDrive.md)
- [getAbout](./docs/getAbout.md)
- [getAccessProposal](./docs/getAccessProposal.md)
- [getApp](./docs/getApp.md)
- [getDrive](./docs/getDrive.md)
- [getStartPageToken](./docs/getStartPageToken.md)
- [hideDrive](./docs/hideDrive.md)
- [listAccessProposals](./docs/listAccessProposals.md)
- [listApps](./docs/listApps.md)
- [listChanges](./docs/listChanges.md)
- [listDrives](./docs/listDrives.md)
- [resolveAccessProposal](./docs/resolveAccessProposal.md)
- [unhideDrive](./docs/unhideDrive.md)
- [updateDrive](./docs/updateDrive.md)
- [watchChanges](./docs/watchChanges.md)

