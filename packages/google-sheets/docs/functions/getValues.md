## Function: `getValues`

Gets values from a range in a Google Sheet.

**Purpose:**
Retrieves the values from a specified range in a Google Sheet.

**Parameters:**

- `range`: Range - An object specifying the sheet ID and range.

**Range Type:**

```typescript
interface Range {
  sheetId: string; // The ID of the sheet. This is a required field and should be a valid string.
  range: string; // The A1 notation of the range. This is a required field and should be a valid string.
}
```

**Return Value:**

- `Promise<any[][]>` - A promise that resolves to a two-dimensional array containing the values in the specified range. Returns an empty array if the range is empty.

**Examples:**

```typescript
// Example usage:
const values = await sdk.getValues({ sheetId: '<sheetId>', range: 'A1:B2' });
console.log(values);
```
