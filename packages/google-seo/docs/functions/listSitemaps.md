## Function: `listSitemaps`

Lists all sitemaps submitted for a site.

**Purpose:**
Retrieves a list of all sitemaps submitted for a verified site.

**Parameters:**

- `siteUrl`: `string` (required)
  - The URL of the site.
- `sitemapIndex`: `string` (optional)
  - If specified, only sitemaps with this index will be returned.

**Return Value:**

- `Promise<SitemapResource[]>`

  - An array of `SitemapResource` objects, each representing a submitted sitemap.

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
// List all sitemaps
try {
  const sitemaps = await sdk.listSitemaps('https://www.example.com/');
  console.log('Sitemaps:', sitemaps);
} catch (error) {
  console.error('Failed to list sitemaps:', error.message);
}

// List sitemaps with a specific index
try {
  const sitemaps = await sdk.listSitemaps(
    'https://www.example.com/',
    'sitemap_index.xml',
  );
  console.log('Sitemaps:', sitemaps);
} catch (error) {
  console.error('Failed to list sitemaps:', error.message);
}
```
