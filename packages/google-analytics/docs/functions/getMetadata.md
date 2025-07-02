## Function: `getMetadata`

Retrieves metadata.

**Purpose:**

Gets metadata information.

**Parameters:**

- `name`: string - The name of the metadata to retrieve.

**Return Value:**

- `Promise<Metadata>` - A promise that resolves to the metadata.

**Examples:**

```typescript
// Example: Get metadata
const metadata = await sdk.getMetadata('properties/<propertyId>/metadata');
console.log(metadata);
```
