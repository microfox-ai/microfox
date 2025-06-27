## Function: `deleteSitemap`

Deletes a sitemap for a site.

**Purpose:**
Removes a sitemap from Google Search Console.

**Parameters:**

- `siteUrl`: `string` (required)
  - The URL of the site.
- `feedpath`: `string` (required)
  - The path of the sitemap.

**Return Value:**

- `Promise<void>`
  - Resolves if the sitemap is successfully deleted.
  - Rejects with an error if the deletion fails.

**Examples:**

```typescript
try {
  await sdk.deleteSitemap('https://www.example.com/', 'sitemap.xml');
  console.log('Sitemap deleted');
} catch (error) {
  console.error('Failed to delete sitemap:', error.message);
}
```
