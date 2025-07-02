## Function: `getSitemap`

Retrieves a specific sitemap.

**Purpose:**
Gets detailed information about a submitted sitemap.

**Parameters:**

- `siteUrl`: `string` (required)
  - The URL of the site.
- `feedpath`: `string` (required)
  - The path of the sitemap.

**Return Value:**

- `Promise<SitemapResource>`

  - A `SitemapResource` object containing information about the sitemap.

  **`SitemapResource` Type:**

  ```typescript
  interface SitemapResource {
    type: string;
    path: string;
    warnings: number;
    errors: number;
    isPending: boolean;
    isSitemapsIndex: boolean;
    isMobileSitemap: boolean;
    lastDownloaded: string;
    lastSubmitted: string;
  }
  ```

  - `type`: `string`
    - The type of sitemap.
    - Possible values: `sitemap`, `sitemapsIndex`, `atomFeed`, `rssFeed`
  - `path`: `string`
    - The path of the sitemap.
  - `warnings`: `number`
    - The number of warnings for the sitemap.
  - `errors`: `number`
    - The number of errors for the sitemap.
  - `isPending`: `boolean`
    - Whether the sitemap is pending processing.
  - `isSitemapsIndex`: `boolean`
    - Whether the sitemap is a sitemap index file.
  - `isMobileSitemap`: `boolean`
    - Whether the sitemap is a mobile sitemap.
  - `lastDownloaded`: `string` (ISO 8601 format)
    - The date and time the sitemap was last downloaded by Google.
  - `lastSubmitted`: `string` (ISO 8601 format)
    - The date and time the sitemap was last submitted.

**Examples:**

```typescript
try {
  const sitemap = await sdk.getSitemap(
    'https://www.example.com/',
    'sitemap.xml',
  );
  console.log('Sitemap information:', sitemap);
} catch (error) {
  console.error('Failed to get sitemap information:', error.message);
}
```
