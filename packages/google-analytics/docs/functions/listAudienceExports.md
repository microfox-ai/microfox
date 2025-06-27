## Function: `listAudienceExports`

Lists audience exports.

**Purpose:**

Retrieves a list of audience exports.

**Parameters:**

- `parent`: string - The parent resource name.

**Return Value:**

- `Promise<ListAudienceExportsResponse>` - A promise that resolves to the list of audience exports.

**Examples:**

```typescript
// Example: List audience exports
const response = await sdk.listAudienceExports('properties/<propertyId>');
console.log(response);
```
