## Constructor: `GoogleCalendarSdk`

Initializes a new instance of the `GoogleCalendarSdk`. This SDK provides methods to interact with the Google Calendar API, allowing for management of calendars, events, access control lists (ACLs), and settings. It handles OAuth 2.0 authentication internally using the provided credentials and tokens.

**Purpose:**
To create a client instance that can be used to make authenticated requests to the Google Calendar API. It requires OAuth 2.0 credentials and tokens for authorization. The SDK will manage token validation and refresh automatically.

**Parameters:**
- `config`: `object` (required) - Configuration object for the SDK.
  - `clientId`: `string` (required) - The client ID obtained from the Google API Console. This is used for OAuth 2.0 authentication.
  - `clientSecret`: `string` (required) - The client secret obtained from the Google API Console. This is used for OAuth 2.0 authentication.
  - `redirectUri`: `string` (required) - The redirect URI registered in the Google API Console. This is used as part of the OAuth 2.0 flow.
  - `accessToken`: `string` (required) - The initial access token for authorizing API requests. The SDK will attempt to use this token and refresh it if it's expired or invalid, using the `refreshToken`.
  - `refreshToken`: `string` (required) - The refresh token used to obtain new access tokens when the current `accessToken` expires. This token is crucial for long-term access without requiring user re-authentication.
  - `scopes`: `array<string>` (optional) - An array of Google API scopes to request. Scopes define the permissions granted to the access token. If not provided, a default set of calendar-related scopes will be used.
    - Default scopes include:
      - `https://www.googleapis.com/auth/calendar` (Read/write access to calendars)
      - `https://www.googleapis.com/auth/calendar.readonly` (Read-only access to calendars)
      - `https://www.googleapis.com/auth/calendar.events` (Read/write access to events)
      - `https://www.googleapis.com/auth/calendar.events.readonly` (Read-only access to events)
      - `https://www.googleapis.com/auth/calendar.settings.readonly` (Read-only access to calendar settings)
      - `https://www.googleapis.com/auth/calendar.calendarlist` (Read/write access to the user's calendar list)
      - `https://www.googleapis.com/auth/calendar.calendarlist.readonly` (Read-only access to the user's calendar list)

**Return Value:**
An instance of `GoogleCalendarSdk` that can be used to call Google Calendar API methods.

**Examples:**
```typescript
// Example 1: Basic initialization with required parameters
const calendarSdk = new GoogleCalendarSdk({
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'https://your.redirect.uri/oauth2callback',
  accessToken: 'USER_INITIAL_ACCESS_TOKEN',
  refreshToken: 'USER_REFRESH_TOKEN',
});

// Example 2: Initialization with custom scopes
const customScopes = [
  'https://www.googleapis.com/auth/calendar.events', // Manage events
  'https://www.googleapis.com/auth/calendar.settings.readonly', // Read calendar settings
];
const calendarSdkWithCustomScopes = new GoogleCalendarSdk({
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'https://your.redirect.uri/oauth2callback',
  accessToken: 'USER_INITIAL_ACCESS_TOKEN',
  refreshToken: 'USER_REFRESH_TOKEN',
  scopes: customScopes,
});
```
