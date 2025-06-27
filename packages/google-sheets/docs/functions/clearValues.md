## Function: `clearValues`

Clears values from a range in a Google Sheet.

**Purpose:**
Clears all values from a specified range in a Google Sheet.

**Parameters:**

- `input`: ClearValuesInput - An object specifying the sheet ID and range.

**ClearValuesInput Type:**

```typescript
interface ClearValuesInput {
  sheetId: string; // The ID of the sheet. This is a required field and should be a valid string.
  range: string; // The A1 notation of the range. This is a required field and should be a valid string.
}
```

**Return Value:**

- `Promise<ApiResponse>` - A promise that resolves to an object containing information about the clear operation. See `updateValues` for the `ApiResponse` type definition.

**Examples:**

```typescript
// Example usage:
const response = await sdk.clearValues({
  sheetId: '<sheetId>',
  range: 'A1:B2',
});
console.log(response);
```
