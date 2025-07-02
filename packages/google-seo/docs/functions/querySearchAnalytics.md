## Function: `querySearchAnalytics`

Queries search analytics data for a site.

**Purpose:**
Retrieves search analytics data for a verified site, such as clicks, impressions, CTR, and position.

**Parameters:**

- `siteUrl`: `string` (required)
  - The URL of the site.
- `params`: `SearchAnalyticsQueryParams` (required)

  - An object containing the query parameters for the search analytics request.

  **`SearchAnalyticsQueryParams` Type:**

  ```typescript
  interface SearchAnalyticsQueryParams {
    startDate: string;
    endDate: string;
    dimensions?: string[];
    searchType?: string;
    dataState?: string;
    rowLimit?: number;
    startRow?: number;
    aggregationType?: string;
  }
  ```

  - `startDate`: `string` (ISO 8601 format) (required)
    - The start date of the data range.
  - `endDate`: `string` (ISO 8601 format) (required)
    - The end date of the data range.
  - `dimensions`: `string[]` (optional)
    - The dimensions to group the data by.
    - Possible values: `country`, `device`, `page`, `query`, `date`
  - `searchType`: `string` (optional)
    - The type of search to filter by.
    - Possible values: `web`, `image`, `video`
  - `dataState`: `string` (optional)
    - The data state to filter by.
    - Possible values: `final`, `all`
  - `rowLimit`: `number` (optional)
    - The maximum number of rows to return.
  - `startRow`: `number` (optional)
    - The starting row index.
  - `aggregationType`: `string` (optional)
    - The aggregation type to use.
    - Possible values: `auto`, `byPage`, `byProperty`

**Return Value:**

- `Promise<{ rows: SearchAnalyticsRow[]; responseAggregationType: string }>`

  - An object containing the search analytics data.

  - `rows`: `SearchAnalyticsRow[]`

    - An array of `SearchAnalyticsRow` objects, each representing a row of data.

    **`SearchAnalyticsRow` Type:**

    ```typescript
    interface SearchAnalyticsRow {
      keys: string[];
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }
    ```

    - `keys`: `string[]`
      - The values for the dimensions specified in the request.
    - `clicks`: `number`
      - The number of clicks.
    - `impressions`: `number`
      - The number of impressions.
    - `ctr`: `number`
      - The click-through rate.
    - `position`: `number`
      - The average position.

  - `responseAggregationType`: `string`
    - The aggregation type used in the response.

**Examples:**

```typescript
try {
  const data = await sdk.querySearchAnalytics('https://www.example.com/', {
    startDate: '2023-10-26',
    endDate: '2023-11-26',
    dimensions: ['query'],
  });
  console.log('Search analytics data:', data);
} catch (error) {
  console.error('Failed to query search analytics data:', error.message);
}
```
