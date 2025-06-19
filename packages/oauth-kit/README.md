# Google OAuth SDK

A robust TypeScript SDK for Google OAuth 2.0 authentication and API integration. This SDK provides a simple way to integrate Google OAuth 2.0 authentication into your application with built-in security features and TypeScript support.

## Installation

```bash
npm install @microfox/google-oauth
```

## Features

- 🔒 Built-in CSRF protection with state parameter
- ✨ TypeScript support with full type definitions
- 🛡️ Input validation using Zod schemas
- 🔄 Refresh token support
- 🎯 Comprehensive Google API scopes
- 🔍 Token validation and introspection

## Usage

1. Import the SDK and necessary types:

```typescript
import { GoogleOAuthSdk, GoogleScope } from '@microfox/google-oauth';
```

2. Initialize the SDK with your Google OAuth credentials:

```typescript
const googleOAuthSdk = new GoogleOAuthSdk({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI',
  scopes: [GoogleScope.OPENID, GoogleScope.PROFILE, GoogleScope.EMAIL], // Optional, these are the default scopes
  state: 'custom-state-string', // Optional, a random state will be generated if not provided
});
```

3. Generate the authorization URL:

```typescript
// The SDK automatically configures offline access and consent prompt
const authUrl = googleOAuthSdk.getAuthUrl();
// This will include access_type=offline and prompt=consent by default
```

4. Handle the OAuth callback:

```typescript
// Get the state from the redirect URL and verify it
const receivedState = new URL(redirectUrl).searchParams.get('state');
const expectedState = await googleOAuthSdk.getState();

if (receivedState === expectedState) {
  const code = new URL(redirectUrl).searchParams.get('code');
  if (code) {
    try {
      const { accessToken, refreshToken, idToken, expiresIn } =
        await googleOAuthSdk.exchangeCodeForTokens(code);
      // Store tokens securely and use them for API calls
    } catch (error) {
      // Handle token exchange error
      console.error('Token exchange failed:', error);
    }
  }
} else {
  // Handle invalid state (potential CSRF attack)
  console.error('Invalid state parameter');
}
```

5. Refresh expired access tokens:

```typescript
try {
  const { accessToken, expiresIn } =
    await googleOAuthSdk.refreshAccessToken(refreshToken);
  // Update stored access token
} catch (error) {
  // Handle refresh token error
  console.error('Token refresh failed:', error);
}
```

6. Validate access tokens:

```typescript
try {
  const result = await googleOAuthSdk.validateAccessToken(accessToken);
  if (result.isValid) {
    console.log('Token is valid');
    console.log('Expires at:', new Date(result.expiresAt!).toISOString());
    console.log('Scopes:', result.scopes);
    console.log('Email:', result.email);
  } else {
    console.error('Token validation failed:', result.error);
  }
} catch (error) {
  console.error('Validation error:', error);
}
```

## Available Scopes

The SDK provides a comprehensive set of Google API scopes through the `GoogleScope` enum:

### Default Scopes (Automatically Included)

- `GoogleScope.OPENID` (`openid`) - OpenID Connect scope
- `GoogleScope.PROFILE` (`profile`) - User's basic profile information
- `GoogleScope.EMAIL` (`email`) - User's email address

### Google Calendar API

- `GoogleScope.CALENDAR` (`https://www.googleapis.com/auth/calendar`) - Full access to Google Calendar
- `GoogleScope.CALENDAR_READONLY` (`https://www.googleapis.com/auth/calendar.readonly`) - Read-only access to calendars
- `GoogleScope.CALENDAR_EVENTS` (`https://www.googleapis.com/auth/calendar.events`) - Manage calendar events
- `GoogleScope.CALENDAR_EVENTS_READONLY` (`https://www.googleapis.com/auth/calendar.events.readonly`) - Read-only access to calendar events

### Google Drive API

- `GoogleScope.DRIVE` (`https://www.googleapis.com/auth/drive`) - Full access to Google Drive
- `GoogleScope.DRIVE_READONLY` (`https://www.googleapis.com/auth/drive.readonly`) - Read-only access to files
- `GoogleScope.DRIVE_FILE` (`https://www.googleapis.com/auth/drive.file`) - Access to files created by the app
- `GoogleScope.DRIVE_METADATA` (`https://www.googleapis.com/auth/drive.metadata`) - View and manage metadata
- `GoogleScope.DRIVE_APPDATA` (`https://www.googleapis.com/auth/drive.appdata`) - Access to application data folder
- `GoogleScope.DRIVE_SCRIPTS` (`https://www.googleapis.com/auth/drive.scripts`) - Modify and execute Google Apps Scripts

### Gmail API

- `GoogleScope.GMAIL` (`https://www.googleapis.com/auth/gmail.readonly`) - Read-only access to Gmail
- `GoogleScope.GMAIL_SEND` (`https://www.googleapis.com/auth/gmail.send`) - Send emails only
- `GoogleScope.GMAIL_COMPOSE` (`https://www.googleapis.com/auth/gmail.compose`) - Create and modify email drafts
- `GoogleScope.GMAIL_MODIFY` (`https://www.googleapis.com/auth/gmail.modify`) - All read/write operations except delete
- `GoogleScope.GMAIL_FULL` (`https://www.googleapis.com/auth/gmail.full`) - Full access to Gmail account

### Google Contacts API

- `GoogleScope.CONTACTS` (`https://www.googleapis.com/auth/contacts`) - Manage contacts
- `GoogleScope.CONTACTS_READONLY` (`https://www.googleapis.com/auth/contacts.readonly`) - Read-only access to contacts
- `GoogleScope.CONTACTS_OTHER_READONLY` (`https://www.googleapis.com/auth/contacts.other.readonly`) - Read-only access to domain's contacts

### YouTube API

- `GoogleScope.YOUTUBE` (`https://www.googleapis.com/auth/youtube`) - Manage YouTube account
- `GoogleScope.YOUTUBE_READONLY` (`https://www.googleapis.com/auth/youtube.readonly`) - Read-only access to YouTube data
- `GoogleScope.YOUTUBE_UPLOAD` (`https://www.googleapis.com/auth/youtube.upload`) - Upload YouTube videos
- `GoogleScope.YOUTUBE_PARTNER` (`https://www.googleapis.com/auth/youtubepartner`) - Manage YouTube content and channel

### Google Photos API

- `GoogleScope.PHOTOS` (`https://www.googleapis.com/auth/photoslibrary`) - Access to Google Photos library
- `GoogleScope.PHOTOS_READONLY` (`https://www.googleapis.com/auth/photoslibrary.readonly`) - Read-only access to photos
- `GoogleScope.PHOTOS_SHARING` (`https://www.googleapis.com/auth/photoslibrary.sharing`) - Share photos and albums

### Google Fitness API

- `GoogleScope.FITNESS` (`https://www.googleapis.com/auth/fitness.activity.read`) - Read fitness activity data
- `GoogleScope.FITNESS_ACTIVITY_WRITE` (`https://www.googleapis.com/auth/fitness.activity.write`) - Write fitness activity data
- `GoogleScope.FITNESS_LOCATION_READ` (`https://www.googleapis.com/auth/fitness.location.read`) - Read location data
- `GoogleScope.FITNESS_LOCATION_WRITE` (`https://www.googleapis.com/auth/fitness.location.write`) - Write location data

### Google Tasks API

- `GoogleScope.TASKS` (`https://www.googleapis.com/auth/tasks`) - Manage tasks and task lists
- `GoogleScope.TASKS_READONLY` (`https://www.googleapis.com/auth/tasks.readonly`) - Read-only access to tasks

### Google Workspace APIs

- `GoogleScope.SHEETS` (`https://www.googleapis.com/auth/spreadsheets`) - Full access to Google Sheets
- `GoogleScope.SHEETS_READONLY` (`https://www.googleapis.com/auth/spreadsheets.readonly`) - Read-only access to Sheets
- `GoogleScope.DOCS` (`https://www.googleapis.com/auth/documents`) - Full access to Google Docs
- `GoogleScope.DOCS_READONLY` (`https://www.googleapis.com/auth/documents.readonly`) - Read-only access to Docs

### Google Cloud Platform

- `GoogleScope.CLOUD_PLATFORM` (`https://www.googleapis.com/auth/cloud-platform`) - Full access to Google Cloud services
- `GoogleScope.CLOUD_PLATFORM_READONLY` (`https://www.googleapis.com/auth/cloud-platform.read-only`) - Read-only access to Cloud services

### Google Analytics

- `GoogleScope.ANALYTICS` (`https://www.googleapis.com/auth/analytics`) - Full access to Analytics data
- `GoogleScope.ANALYTICS_READONLY` (`https://www.googleapis.com/auth/analytics.readonly`) - Read-only access to Analytics

### Google Classroom

- `GoogleScope.CLASSROOM_COURSES` (`https://www.googleapis.com/auth/classroom.courses`) - Manage Classroom courses
- `GoogleScope.CLASSROOM_COURSES_READONLY` (`https://www.googleapis.com/auth/classroom.courses.readonly`) - View Classroom courses
- `GoogleScope.CLASSROOM_ROSTERS` (`https://www.googleapis.com/auth/classroom.rosters`) - Manage class rosters
- `GoogleScope.CLASSROOM_PROFILE_EMAILS` (`https://www.googleapis.com/auth/classroom.profile.emails`) - View student/teacher email addresses

### Google Meet

- `GoogleScope.MEET` (`https://www.googleapis.com/auth/meetings.space.readonly`) - View Meet space information
- `GoogleScope.MEET_ROOMS` (`https://www.googleapis.com/auth/meetings.room.readonly`) - View Meet room information

### Google People API

- `GoogleScope.PEOPLE` (`https://www.googleapis.com/auth/people`) - Manage contacts and other people data
- `GoogleScope.PEOPLE_READONLY` (`https://www.googleapis.com/auth/people.readonly`) - Read-only access to people data

### Google Chat API

- `GoogleScope.CHAT` (`https://www.googleapis.com/auth/chat.messages`) - Allows the application to send and manage chat messages on behalf of the user.
- `GoogleScope.CHAT_READONLY` (`https://www.googleapis.com/auth/chat.messages.readonly`) - Provides the application with read-only access to the user's chat messages.

### Google Search Console API

- `GoogleScope.WEBMASTERS` (`https://www.googleapis.com/auth/webmasters`) - Grants the application full access to the user's Search Console data.
- `GoogleScope.WEBMASTERS_READONLY` (`https://www.googleapis.com/auth/webmasters.readonly`) - Provides the application with read-only access to the user's Search Console data.

## Error Handling

The SDK uses Zod for input validation and provides clear error messages:

```typescript
try {
  const { accessToken, refreshToken, idToken, expiresIn } =
    await googleOAuthSdk.exchangeCodeForTokens(code);
} catch (error) {
  if (error instanceof Error) {
    console.error('OAuth error:', error.message);
    // Error messages will be in format: "error_code: error_description"
  }
}
```

## Security Best Practices

This SDK implements several security features:

- CSRF protection using state parameter (auto-generated if not provided)
- Input validation using Zod schemas
- Automatic offline access configuration for refresh tokens
- Forced consent prompt to ensure user awareness
- Type-safe token handling
- Token validation and introspection

Best practices for implementation:

- Store client credentials securely (use environment variables)
- Keep access and refresh tokens secure
- Use HTTPS for all OAuth endpoints
- Always verify the state parameter on callbacks
- Implement proper session management
- Never expose tokens in client-side code or URLs
- Regularly validate access tokens before use

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0 (for TypeScript users)

## License

This SDK is released under the MIT License.
