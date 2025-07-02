## Function: `createAudienceExport`

Creates an audience export.

**Purpose:**

Creates a new audience export.

**Parameters:**

- `parent`: string - The parent resource name.
- `request`: CreateAudienceExportRequest - The audience export request parameters.

**Return Value:**

- `Promise<AudienceExport>` - A promise that resolves to the created audience export.

**Examples:**

```typescript
// Example: Create an audience export
const audienceExport = await sdk.createAudienceExport(
  'properties/<propertyId>',
  { audience: '<audienceId>', audienceDisplayName: '<displayName>' },
);
console.log(audienceExport);
```
