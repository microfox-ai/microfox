## Function: `submitSitemap`

Submits a sitemap for a site.

**Purpose:**
Informs Google Search Console about a new or updated sitemap for a verified site.

**Parameters:**

- `siteUrl`: `string` (required)
  - The URL of the site.
- `feedpath`: `string` (required)
  - The path of the sitemap.

**Return Value:**

- `Promise<void>`
  - Resolves if the sitemap is successfully submitted.
  - Rejects with an error if the submission fails.

**Examples:**

```typescript
try {
  await sdk.submitSitemap('https://www.example.com/', 'sitemap.xml');
  console.log('Sitemap submitted');
} catch (error) {
  console.error('Failed to submit sitemap:', error.message);
}
```
