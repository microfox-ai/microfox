## Function: `listAudienceLists`

Lists audience lists.

**Purpose:**

Retrieves a list of audience lists.

**Parameters:**

- `parent`: string - The parent resource name.

**Return Value:**

- `Promise<ListAudienceListsResponse>` - A promise that resolves to the list of audience lists.

**Examples:**

```typescript
// Example: List audience lists
const response = await sdk.listAudienceLists('properties/<propertyId>');
console.log(response);
```
