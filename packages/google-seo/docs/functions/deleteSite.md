## Function: `deleteSite`

Deletes a site from the list of verified sites.

**Purpose:**
Removes a site from Google Search Console.

**Parameters:**

- `siteUrl`: `string` (required)
  - The URL of the site to delete.

**Return Value:**

- `Promise<void>`
  - Resolves if the site is successfully deleted.
  - Rejects with an error if the deletion fails.

**Examples:**

```typescript
try {
  await sdk.deleteSite('https://www.example.com/');
  console.log('Site deleted');
} catch (error) {
  console.error('Failed to delete site:', error.message);
}
```
