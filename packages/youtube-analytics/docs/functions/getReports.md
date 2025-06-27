## Function: `getReports`

Retrieves reports from the YouTube Analytics API.

**Purpose:**
This function retrieves data reports from the YouTube Analytics API based on the specified parameters.

**Parameters:**

- `params` (ReportQueryParams, required): An object containing the parameters for the report request.
  - `ids` (string, required): The channel or content owner ID. Possible values: `"channel==<CHANNEL_ID>"`, `"contentOwner==<CONTENT_OWNER_ID>"`.
  - `startDate` (string, required): The start date for the report data in `YYYY-MM-DD` format. Example: `"2024-01-01"`.
  - `endDate` (string, required): The end date for the report data in `YYYY-MM-DD` format. Example: `"2024-01-31"`.
  - `metrics` (string, required): A comma-separated list of metrics to include in the report. Example: `"views,likes,dislikes"`.
  - `currency` (string, optional): The three-letter ISO 4217 currency code for monetary reports. Example: `"USD"`.
  - `dimensions` (string, optional): A comma-separated list of dimensions to include in the report. Example: `"day,video"`.
  - `filters` (string, optional): Filtering criteria for the report data. Example: `"video==<VIDEO_ID>"`.
  - `includeHistoricalChannelData` (boolean, optional): Include data prior to channel linking for content owner reports.
  - `maxResults` (number, optional): The maximum number of rows to return in the report.
  - `sort` (string, optional): A comma-separated list of dimensions or metrics to sort the report by. Example: `"views,-likes"`.
  - `startIndex` (number, optional): The 1-based index of the first row to retrieve.

**Return Value:**

- `Promise<ReportResponse>`: A promise that resolves to the report data.
  - `kind` (string): Always `"youtubeAnalytics#resultTable"`.
  - `columnHeaders` (array<object>): An array of column headers.
    - `name` (string): The name of the column.
    - `dataType` (string): The data type of the column.
    - `columnType` (string): The type of the column.
  - `rows` (array<array<string | number>>, optional): An array of rows, where each row is an array of values corresponding to the column headers.

**Examples:**

```typescript
// Example 1: Get daily view counts for a channel
const reports = await sdk.getReports({
  ids: 'channel==MINE',
  startDate: '2023-01-01',
  endDate: '2023-01-31',
  metrics: 'views',
  dimensions: 'day',
});

// Example 2: Get total views, likes, and dislikes for a video
const reports = await sdk.getReports({
  ids: 'channel==MINE',
  startDate: '2023-01-01',
  endDate: '2023-01-31',
  metrics: 'views,likes,dislikes',
  filters: 'video==<VIDEO_ID>',
});
```