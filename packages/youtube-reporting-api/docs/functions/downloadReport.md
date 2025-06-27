## Function: `downloadReport`

Downloads the report data from the provided URL.

**Purpose:**
Downloads the actual report data from the URL provided in the report object.

**Parameters:**

- `downloadUrl`: `string` - The URL to download the report data from.  This should be a valid URL string.

**Return Value:**

- `Promise<string>` - A promise that resolves to a string containing the downloaded report data.

**Examples:**

```typescript
// Example 1: Download report data
const reportData = await sdk.downloadReport('<download url>');
console.log(reportData);
```