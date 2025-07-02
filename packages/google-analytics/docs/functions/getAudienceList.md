## Function: `getAudienceList`

Retrieves an audience list.

**Purpose:**

Gets an existing audience list.

**Parameters:**

- `name`: string - The name of the audience list to retrieve.

**Return Value:**

- `Promise<AudienceList>` - A promise that resolves to the audience list.

**Examples:**

```typescript
// Example: Get an audience list
const audienceList = await sdk.getAudienceList(
  'properties/<propertyId>/audienceLists/<audienceListId>',
);
console.log(audienceList);
```
