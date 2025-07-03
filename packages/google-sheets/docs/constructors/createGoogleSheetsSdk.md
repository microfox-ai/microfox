## Constructor: `createGoogleSheetsSdk`

Creates an instance of the Google Sheets SDK.

**Purpose:**
Initializes a new instance of the `GoogleSheetsSdk` with the provided configuration. This sets up the OAuth2 client and other necessary components for interacting with the Google Sheets API.

**Parameters:**

- `config`: GoogleSheetsSdkConfig - The configuration object for the SDK.

**Return Value:**

- `GoogleSheetsSdk` - An instance of the Google Sheets SDK.

**`GoogleSheetsSdkConfig` Type:**

```typescript
interface GoogleSheetsSdkConfig {
  clientId: string; // The client ID for Google OAuth. This is a required field and should be a valid string.
  clientSecret: string; // The client secret for Google OAuth. This is a required field and should be a valid string.
  accessToken: string; // The access token for Google OAuth. This is a required field and should be a valid string.
  refreshToken: string; // The refresh token for Google OAuth. This is a required field and should be a valid string.
}
```

**Examples:**

```typescript
// Example 1: Creating an SDK instance with environment variables
const sdk = createGoogleSheetsSdk({
  clientId: process.env.GOOGLE_CLIENT_ID || '<GOOGLE_CLIENT_ID>',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '<GOOGLE_CLIENT_SECRET>',
  accessToken: process.env.GOOGLE_ACCESS_TOKEN || '<GOOGLE_ACCESS_TOKEN>',
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN || '<GOOGLE_REFRESH_TOKEN>',
});
```
