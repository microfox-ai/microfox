## Constructor: `createGoogleCalendarSDK`

Factory function to create an instance of the `GoogleCalendarSdk`. This function simplifies the instantiation of the SDK by accepting a configuration object.

**Purpose:**
To provide a convenient way to initialize and configure the `GoogleCalendarSdk` for interacting with the Google Calendar API.

**Parameters:**

- `config`: object (required) - Configuration object for the SDK.
  - `clientId`: string (required) - The client ID obtained from the Google API Console.
  - `clientSecret`: string (required) - The client secret obtained from the Google API Console.
  - `accessToken`: string (required) - The access token for authorizing API requests.
  - `refreshToken`: string (required) - The refresh token for obtaining new access tokens.
  - `scopes`: array<string> (optional) - An array of Google API scopes to request. Defaults to a comprehensive list of calendar-related scopes.
    - Example: `['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events']`

**Environment Variables:**

You can configure the SDK using environment variables instead of passing parameters directly:

- `GOOGLE_CLIENT_ID`: The client ID obtained from the Google API Console for your OAuth2 application.
- `GOOGLE_CLIENT_SECRET`: The client secret obtained from the Google API Console for your OAuth2 application.
- `GOOGLE_CALENDAR_ACCESS_TOKEN`: The access token for Google Calendar API. This token grants access to the user's Google Calendar data.
- `GOOGLE_CALENDAR_REFRESH_TOKEN`: The refresh token for Google Calendar API. This token is used to obtain a new access token when the current one expires.
- `GOOGLE_CALENDAR_SCOPES`: A space-separated list of scopes required for Google Calendar API access. Defaults to a predefined set of calendar scopes if not provided.

**Return Value:**

- `GoogleCalendarSdk`: object (required) - An instance of the `GoogleCalendarSdk` configured with the provided credentials and settings.

**Examples:**

```typescript
// Example 1: Using environment variables (recommended)
const sdkWithEnvVars = createGoogleCalendarSDK({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  accessToken: process.env.GOOGLE_CALENDAR_ACCESS_TOKEN!,
  refreshToken: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN!,
  scopes: process.env.GOOGLE_CALENDAR_SCOPES?.split(','),
});
```

**Default Scopes:**

If no scopes are provided, the SDK defaults to the following comprehensive list of calendar-related scopes:

- `https://www.googleapis.com/auth/calendar.readonly`
- `https://www.googleapis.com/auth/calendar.acls.readonly`
- `https://www.googleapis.com/auth/calendar.events`
- `https://www.googleapis.com/auth/calendar.events.readonly`
- `https://www.googleapis.com/auth/calendar.events.owned`
- `https://www.googleapis.com/auth/calendar.events.public.readonly`
- `https://www.googleapis.com/auth/calendar.events.owned.readonly`
- `https://www.googleapis.com/auth/calendar.freebusy`
- `https://www.googleapis.com/auth/calendar.events.freebusy`
- `https://www.googleapis.com/auth/calendar.settings.readonly`
- `https://www.googleapis.com/auth/calendar.calendarlist.readonly`
