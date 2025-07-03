## Function: `inspectUrl`

Inspects a URL.

**Purpose:**
Requests an inspection of a URL and retrieves the inspection results.

**Parameters:**

- `params`: `UrlInspectionParams` (required)

  - An object containing the parameters for the URL inspection request.

  **`UrlInspectionParams` Type:**

  ```typescript
  interface UrlInspectionParams {
    inspectionUrl: string;
    siteUrl: string;
    languageCode?: string;
  }
  ```

  - `inspectionUrl`: `string` (required)
    - The URL to inspect.
  - `siteUrl`: `string` (required)
    - The URL of the site that the inspected URL belongs to.
  - `languageCode`: `string` (optional)
    - The language code of the inspected URL.

**Return Value:**

- `Promise<UrlInspectionResult>`

  - An object containing the URL inspection results.

  **`UrlInspectionResult` Type:**

  ```typescript
  interface UrlInspectionResult {
    indexStatus: string;
    crawledAs: string;
    pageFetchState: string;
    mobileUsability: {
      issues: string[];
    };
    richResults: {
      issues: string[];
    };
    indexingState: string;
  }
  ```

  - `indexStatus`: `string`
    - The index status of the URL.
    - Possible values: `INDEXED`, `NOT_INDEXED`, `PARTIALLY_INDEXED`
  - `crawledAs`: `string`
    - The user agent used to crawl the URL.
    - Possible values: `DESKTOP`, `MOBILE`
  - `pageFetchState`: `string`
    - The page fetch state.
    - Possible values: `SUCCESSFUL`, `FAILED`
  - `mobileUsability`: `object`
    - Information about the mobile usability of the URL.
    - `issues`: `string[]`
      - An array of mobile usability issues.
  - `richResults`: `object`
    - Information about rich results for the URL.
    - `issues`: `string[]`
      - An array of rich result issues.
  - `indexingState`: `string`
    - The indexing state of the URL.
    - Possible values: `INDEXED`, `NOT_INDEXED`

**Examples:**

```typescript
try {
  const result = await sdk.inspectUrl({
    inspectionUrl: 'https://www.example.com/page',
    siteUrl: 'https://www.example.com/',
  });
  console.log('URL inspection result:', result);
} catch (error) {
  console.error('Failed to inspect URL:', error.message);
}
```
