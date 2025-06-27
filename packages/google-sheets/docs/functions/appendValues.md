## Function: `appendValues`

Appends values to a Google Sheet.

**Purpose:**
Appends the provided data to a specified range in a Google Sheet.

**Parameters:**

- `input`: AppendValuesInput - An object containing the range and values to append.
- `valueInputOption`: ValueInputOption = 'USER_ENTERED' - How the input data should be interpreted. Possible values: 'USER_ENTERED', 'RAW', 'INPUT_VALUE_OPTION_UNSPECIFIED'. Defaults to 'USER_ENTERED'.
- `insertDataOption`: InsertDataOption = 'INSERT_ROWS' - How the input data should be inserted. Possible values: 'INSERT_ROWS', 'OVERWRITE'. Defaults to 'INSERT_ROWS'.

**AppendValuesInput Type:**

```typescript
interface AppendValuesInput {
  range: Range; // The range to append to. This is a required field.
  values: any[][]; // The values to be appended. This is a required field and should be a two-dimensional array.
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

- `Promise<ApiResponse>` - A promise that resolves to an object containing information about the append operation. See `updateValues` for the `ApiResponse` type definition.

**Examples:**

```typescript
// Example usage:
const response = await sdk.appendValues({
  range: { sheetId: '<sheetId>', range: 'A1:B2' },
  values: [
    ['new value 1', 'new value 2'],
    ['new value 3', 'new value 4'],
  ],
});
console.log(response);
```
