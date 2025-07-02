## Function: `getRecurringAudienceList`

Retrieves a recurring audience list.

**Purpose:**

Gets an existing recurring audience list.

**Parameters:**

- `name`: string - The name of the recurring audience list to retrieve.

**Return Value:**

- `Promise<RecurringAudienceList>` - A promise that resolves to the recurring audience list.

**Examples:**

```typescript
// Example: Get a recurring audience list
const recurringAudienceList = await sdk.getRecurringAudienceList(
  'properties/<propertyId>/recurringAudienceLists/<recurringAudienceListId>',
);
console.log(recurringAudienceList);
```
