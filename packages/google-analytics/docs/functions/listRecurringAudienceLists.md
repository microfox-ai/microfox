## Function: `listRecurringAudienceLists`

Lists recurring audience lists.

**Purpose:**

Retrieves a list of recurring audience lists.

**Parameters:**

- `parent`: string - The parent resource name.

**Return Value:**

- `Promise<ListRecurringAudienceListsResponse>` - A promise that resolves to the list of recurring audience lists.

**Examples:**

```typescript
// Example: List recurring audience lists
const response = await sdk.listRecurringAudienceLists(
  'properties/<propertyId>',
);
console.log(response);
```
