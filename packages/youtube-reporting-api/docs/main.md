# YouTube Reporting API

A TypeScript SDK for interacting with the YouTube Reporting API.

## Installation

```bash
npm install @microfox/youtube-reporting-api @microfox/google-oauth
```

## Environment Variables

The following environment variables are used by this SDK:

- `GOOGLE_CLIENT_ID`: The client ID for the Google OAuth 2.0 credentials. (Required)
- `GOOGLE_CLIENT_SECRET`: The client secret for the Google OAuth 2.0 credentials. (Required)
- `GOOGLE_REDIRECT_URI`: The redirect URI for the Google OAuth 2.0 flow. (Required)
- `GOOGLE_ACCESS_TOKEN`: The access token for authenticated requests (optional). (Optional)
- `GOOGLE_REFRESH_TOKEN`: The refresh token to obtain new access tokens (optional). (Optional)
- `SCOPES`: The scopes required for the YouTube Reporting API. (Required)

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [YouTubeReportingAPISDK](./docs/YouTubeReportingAPISDK.md)
- [listReportTypes](./docs/listReportTypes.md)
- [createJob](./docs/createJob.md)
- [listJobs](./docs/listJobs.md)
- [listReports](./docs/listReports.md)
- [downloadReport](./docs/downloadReport.md)
