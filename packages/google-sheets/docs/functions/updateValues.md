## Function: `updateValues`

Updates values in a range of a Google Sheet.

**Purpose:**
Updates the values in a specified range of a Google Sheet with the provided data.

**Parameters:**

- `input`: UpdateValuesInput - An object containing the range and values to update.
- `valueInputOption`: ValueInputOption = 'USER_ENTERED' - How the input data should be interpreted. Possible values: 'USER_ENTERED', 'RAW', 'INPUT_VALUE_OPTION_UNSPECIFIED'. Defaults to 'USER_ENTERED'.

**UpdateValuesInput Type:**

```typescript
interface UpdateValuesInput {
  range: Range; // The range to update. This is a required field.
  values: any[][]; // The values to be updated. This is a required field and should be a two-dimensional array.
}
```

**Range Type:**

```typescript
interface Range {
  sheetId: string; // The ID of the sheet. This is a required field and should be a valid string.
  range: string; // The A1 notation of the range. This is a required field and should be a valid string.
}
```

**Return Value:**

- `Promise<ApiResponse>` - A promise that resolves to an object containing information about the update operation.

**ApiResponse Type:**

```typescript
interface ApiResponse {
  spreadsheetId: string; // The ID of the spreadsheet. This is a required field and should be a valid string.
  updatedRange?: string; // The range that was updated. This is an optional field and should be a valid string if present.
  updatedRows?: number; // The number of rows updated. This is an optional field and should be a valid number if present.
  updatedColumns?: number; // The number of columns updated. This is an optional field and should be a valid number if present.
  updatedCells?: number; // The number of cells updated. This is an optional field and should be a valid number if present.
  clearedRange?: string; // The range that was cleared. This is an optional field and should be a valid string if present.
}
```

**Examples:**

```typescript
// Example usage:
const response = await sdk.updateValues({
  range: { sheetId: '<sheetId>', range: 'A1:B2' },
  values: [
    ['new value 1', 'new value 2'],
    ['new value 3', 'new value 4'],
  ],
});
console.log(response);
```
