## Function: `listSites`

Lists all sites verified by the authenticated user.

**Purpose:**
Retrieves a list of all sites that the authenticated user has verified in Google Search Console.

**Parameters:**
None

**Return Value:**

- `Promise<SitesResource[]>`

  - An array of `SitesResource` objects, each representing a verified site.

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
  const sites = await sdk.listSites();
  console.log('Verified sites:', sites);
} catch (error) {
  console.error('Failed to list sites:', error.message);
}
```
