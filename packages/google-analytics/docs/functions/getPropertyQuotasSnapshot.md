## Function: `getPropertyQuotasSnapshot`

Retrieves property quotas snapshot.

**Purpose:**

Gets a snapshot of property quotas.

**Parameters:**

- `name`: string - The name of the property quotas snapshot to retrieve.

**Return Value:**

- `Promise<PropertyQuotasSnapshot>` - A promise that resolves to the property quotas snapshot.

**Examples:**

```typescript
// Example: Get property quotas snapshot
const snapshot = await sdk.getPropertyQuotasSnapshot(
  'properties/<propertyId>/quotasSnapshot',
);
console.log(snapshot);
```
