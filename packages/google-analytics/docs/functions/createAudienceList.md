## Function: `createAudienceList`

Creates an audience list.

**Purpose:**

Creates a new audience list.

**Parameters:**

- `parent`: string - The parent resource name.
- `request`: CreateAudienceListRequest - The audience list request parameters.

**Return Value:**

- `Promise<AudienceList>` - A promise that resolves to the created audience list.

**Examples:**

```typescript
// Example: Create an audience list
const audienceList = await sdk.createAudienceList('properties/<propertyId>', {
  audienceList: { name: '<name>', description: '<description>' },
});
console.log(audienceList);
```
