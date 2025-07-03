## Function: `batchClearValues`

Batch clears values from multiple ranges in a Google Sheet.

**Purpose:**
Clears all values from multiple specified ranges in a Google Sheet in a single batch request.

**Parameters:**

- `sheetId`: string - The ID of the sheet. This is a required field and should be a valid string.
- `ranges`: string[] - An array of A1 notations of the ranges to clear. This is a required field and should be an array of valid strings.

**Return Value:**

- `Promise<ApiResponse>` - A promise that resolves to an object containing information about the clear operation. See `updateValues` for the `ApiResponse` type definition.

**Examples:**

```typescript
// Example usage:
const response = await sdk.batchClearValues('<sheetId>', ['A1:B2', 'C1:D2']);
console.log(response);
```
