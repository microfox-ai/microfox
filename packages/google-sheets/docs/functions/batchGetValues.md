## Function: `batchGetValues`

Batch gets values from multiple ranges in a Google Sheet.

**Purpose:**
Retrieves the values from multiple specified ranges in a Google Sheet in a single batch request.

**Parameters:**

- `sheetId`: string - The ID of the sheet. This is a required field and should be a valid string.
- `ranges`: string[] - An array of A1 notations of the ranges to retrieve. This is a required field and should be an array of valid strings.

**Return Value:**

- `Promise<any[][][]>` - A promise that resolves to a three-dimensional array containing the values in the specified ranges. Each element in the outer array corresponds to a range, and each inner array contains the rows and columns of data for that range.

**Examples:**

```typescript
// Example usage:
const values = await sdk.batchGetValues('<sheetId>', ['A1:B2', 'C1:D2']);
console.log(values);
```
