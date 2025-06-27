## Function: `batchUpdateValues`

Batch updates values in multiple ranges of a Google Sheet.

**Purpose:**
Updates the values in multiple specified ranges of a Google Sheet with the provided data in a single batch request.

**Parameters:**

- `sheetId`: string - The ID of the sheet. This is a required field and should be a valid string.
- `inputs`: UpdateValuesInput[] - An array of objects, each containing the range and values to update. This is a required field.
- `valueInputOption`: ValueInputOption = 'USER_ENTERED' - How the input data should be interpreted. Possible values: 'USER_ENTERED', 'RAW', 'INPUT_VALUE_OPTION_UNSPECIFIED'. Defaults to 'USER_ENTERED'.

**UpdateValuesInput Type:**
See `updateValues` for the `UpdateValuesInput` type definition.

**Return Value:**

- `Promise<ApiResponse[]>` - A promise that resolves to an array of objects, each containing information about an update operation in the batch. See `updateValues` for the `ApiResponse` type definition.

**Examples:**

```typescript
// Example usage:
const responses = await sdk.batchUpdateValues('<sheetId>', [
  {
    range: { sheetId: '<sheetId>', range: 'A1:B2' },
    values: [['new value 1', 'new value 2']],
  },
  {
    range: { sheetId: '<sheetId>', range: 'C1:D2' },
    values: [['new value 3', 'new value 4']],
  },
]);
console.log(responses);
```
