# Google Calendar

A TypeScript SDK for interacting with the Google Calendar API.

## Installation

```bash
npm install @microfox/google-calendar
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `GOOGLE_CLIENT_ID`: Your Google Cloud project's OAuth 2.0 Client ID. This is used to identify your application to Google's authentication servers. ** (Required)**
- `GOOGLE_CLIENT_SECRET`: Your Google Cloud project's OAuth 2.0 Client Secret. This is used to authenticate your application to Google's authentication servers. ** (Required)**
- `GOOGLE_REDIRECT_URI`: The URI to which Google will redirect the user after they have authorized your application. This must match one of the authorized redirect URIs configured in your Google Cloud project. ** (Required)**
- `GOOGLE_ACCESS_TOKEN`: An existing Google OAuth 2.0 Access Token for API authentication. The SDK will use this token and attempt to refresh it if a refresh token is also provided. ** (Required)**
- `GOOGLE_REFRESH_TOKEN`: An existing Google OAuth 2.0 Refresh Token. Used to obtain a new access token when the current one expires. ** (Required)**
- `GOOGLE_SCOPES`: A comma-separated or space-separated list of Google API scopes that your application requires. If not provided, the SDK defaults to a comprehensive set of Google Calendar scopes (e.g., 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'). The application should parse this string into an array of strings before passing it to the SDK constructor. (Optional)

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**GoogleCalendarSdk** (Constructor)](./docs/GoogleCalendarSdk.md): Initializes the client.

