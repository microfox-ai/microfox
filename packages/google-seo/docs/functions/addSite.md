## Function: `addSite`

Adds a site to the list of verified sites.

**Purpose:**
Verifies ownership of a site and adds it to Google Search Console.

**Parameters:**

- `siteUrl`: `string` (required)
  - The URL of the site to add.

**Return Value:**

- `Promise<void>`
  - Resolves if the site is successfully added.
  - Rejects with an error if the addition fails.

**Examples:**

```typescript
try {
  await sdk.addSite('https://www.example.com/');
  console.log('Site added');
} catch (error) {
  console.error('Failed to add site:', error.message);
}
```
