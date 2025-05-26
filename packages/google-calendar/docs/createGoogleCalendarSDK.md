## Function: `createGoogleCalendarSDK`

This factory function provides a convenient way to create and initialize an instance of the `GoogleCalendarSdk`.

**Purpose:**
To instantiate the `GoogleCalendarSdk` with the necessary OAuth 2.0 credentials and tokens. It simplifies the creation process by abstracting the `new` keyword.

**Parameters:**
- `config`: `object` (required) - Configuration object for the SDK.
  - `clientId`: `string` (required) - The client ID obtained from the Google API Console.
  - `clientSecret`: `string` (required) - The client secret obtained from the Google API Console.
  - `redirectUri`: `string` (required) - The redirect URI authorized in the Google API Console.
  - `accessToken`: `string` (required) - The access token for authorizing API requests.
  - `refreshToken`: `string` (required) - The refresh token used to obtain a new access token if the current one is expired or invalid.
  - `scopes`: `array<string>` (optional) - An array of strings representing the scopes for Google Calendar API access. If not provided, a default set of comprehensive calendar scopes will be used by the `GoogleCalendarSdk` constructor.

**Return Value:**
- `GoogleCalendarSdk`: An instance of the `GoogleCalendarSdk` configured with the provided parameters.

**Examples:**
```typescript
// Example 1: Minimal usage with required arguments
const sdkInstance = createGoogleCalendarSDK({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
  accessToken: "USER_ACCESS_TOKEN",
  refreshToken: "USER_REFRESH_TOKEN",
});

// Example 2: Usage with optional scopes parameter
const customScopes = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];
const sdkInstanceWithScopes = createGoogleCalendarSDK({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
  accessToken: "USER_ACCESS_TOKEN",
  refreshToken: "USER_REFRESH_TOKEN",
  scopes: customScopes,
});
```