# Google Analytics SDK

A TypeScript SDK for interacting with the Google Analytics API.

## Installation

```bash
npm install @microfox/google-analytics
```

## Environment Variables

The following environment variables are used by this SDK:

- `GOOGLE_ANALYTICS_CLIENT_ID`: The client ID for your Google Cloud project. (Required)
- `GOOGLE_ANALYTICS_CLIENT_SECRET`: The client secret for your Google Cloud project. (Required)
- `GOOGLE_ANALYTICS_REDIRECT_URI`: The redirect URI for your OAuth 2.0 credentials. (Required)
- `GOOGLE_ANALYTICS_ACCESS_TOKEN`: The access token for authenticating with the Google Analytics Data API. (Required)

## Additional Information

To use this Google Analytics SDK, you need to set up a Google Cloud project and enable the Google Analytics Data API.

Visit the Google Cloud Console (https://console.cloud.google.com/) to create a new project or select an existing one.

Enable the Google Analytics Data API for your project in the API Library.

Create OAuth 2.0 credentials (client ID and client secret) in the Credentials section.

Set up your OAuth consent screen with the necessary scopes ('https://www.googleapis.com/auth/analytics.readonly' for read-only access or 'https://www.googleapis.com/auth/analytics' for full access).

Store your client ID, client secret, and redirect URI securely. Never commit these to version control.

Set up environment variables for your credentials:

- GOOGLE_ANALYTICS_CLIENT_ID

- GOOGLE_ANALYTICS_CLIENT_SECRET

- GOOGLE_ANALYTICS_REDIRECT_URI

- GOOGLE_ANALYTICS_ACCESS_TOKEN

Obtain an access token using the OAuth 2.0 flow. You can use the @microfox/google-oauth package to handle the OAuth process.

When initializing the SDK, use the createGoogleAnalyticsSDK function and pass in the required configuration.

Be aware of Google Analytics API quotas and limits. Default quota is 10,000 requests per day per project.

For high-volume applications, consider implementing exponential backoff and retry logic for API requests.

Always validate and sanitize user inputs before passing them to the API to prevent injection attacks.

Keep your access token secure and refresh it when necessary using the refreshAccessToken method.

Consult the official Google Analytics Data API documentation for the most up-to-date information on endpoints, parameters, and best practices.

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [GoogleAnalyticsSDK](./docs/GoogleAnalyticsSDK.md)
- [runReport](./docs/runReport.md)
- [batchRunReports](./docs/batchRunReports.md)
- [runPivotReport](./docs/runPivotReport.md)
- [batchRunPivotReports](./docs/batchRunPivotReports.md)
- [getMetadata](./docs/getMetadata.md)
- [checkCompatibility](./docs/checkCompatibility.md)
- [runRealtimeReport](./docs/runRealtimeReport.md)
- [createAudienceExport](./docs/createAudienceExport.md)
- [getAudienceExport](./docs/getAudienceExport.md)
- [listAudienceExports](./docs/listAudienceExports.md)
- [runFunnelReport](./docs/runFunnelReport.md)
- [getPropertyQuotasSnapshot](./docs/getPropertyQuotasSnapshot.md)
- [createAudienceList](./docs/createAudienceList.md)
- [getAudienceList](./docs/getAudienceList.md)
- [listAudienceLists](./docs/listAudienceLists.md)
- [createRecurringAudienceList](./docs/createRecurringAudienceList.md)
- [getRecurringAudienceList](./docs/getRecurringAudienceList.md)
- [listRecurringAudienceLists](./docs/listRecurringAudienceLists.md)
- [createReportTask](./docs/createReportTask.md)
- [getReportTask](./docs/getReportTask.md)
- [listReportTasks](./docs/listReportTasks.md)
- [refreshAccessToken](./docs/refreshAccessToken.md)
