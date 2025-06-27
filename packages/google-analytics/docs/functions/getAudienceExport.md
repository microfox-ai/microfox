## Function: `getAudienceExport`

Retrieves an audience export.

**Purpose:**

Gets an existing audience export.

**Parameters:**

- `name`: string - The name of the audience export to retrieve.

**Return Value:**

- `Promise<AudienceExport>` - A promise that resolves to the audience export.

**Examples:**

```typescript
// Example: Get an audience export
const audienceExport = await sdk.getAudienceExport(
  'properties/<propertyId>/audienceExports/<audienceExportId>',
);
console.log(audienceExport);
```
