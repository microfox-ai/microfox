## Function: `createRecurringAudienceList`

Creates a recurring audience list.

**Purpose:**

Creates a new recurring audience list.

**Parameters:**

- `parent`: string - The parent resource name.
- `request`: CreateRecurringAudienceListRequest - The recurring audience list request parameters.

**Return Value:**

- `Promise<RecurringAudienceList>` - A promise that resolves to the created recurring audience list.

**Examples:**

```typescript
// Example: Create a recurring audience list
const recurringAudienceList = await sdk.createRecurringAudienceList(
  'properties/<propertyId>',
  {
    recurringAudienceList: {
      name: '<name>',
      description: '<description>',
      refreshSchedule: { frequency: 'DAILY' },
    },
  },
);
console.log(recurringAudienceList);
```
