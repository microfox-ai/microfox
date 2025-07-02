## Function: `getSite`

Retrieves information about a specific site.

**Purpose:**
Gets detailed information about a verified site.

**Parameters:**

- `siteUrl`: `string` (required)
  - The URL of the site to retrieve information for.

**Return Value:**

- `Promise<SitesResource>`

  - A `SitesResource` object containing information about the site.

  **`SitesResource` Type:**

  ```typescript
  interface SitesResource {
    permissionLevel: string;
    siteUrl: string;
  }
  ```

  - `permissionLevel`: `string`
    - The level of permission the authenticated user has for this site.
    - Possible values: `siteOwner`, `siteFullUser`, `siteRestrictedUser`, `siteUnverifiedUser`
  - `siteUrl`: `string`
    - The URL of the verified site.

**Examples:**

```typescript
try {
  const site = await sdk.getSite('https://www.example.com/');
  console.log('Site information:', site);
} catch (error) {
  console.error('Failed to get site information:', error.message);
}
```
