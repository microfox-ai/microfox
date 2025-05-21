
# sanitizeSheetData

Removes whitespace padding from all string cells in a given range and updates the sheet.

## Parameters
- `input` (`UpdateValuesInput`): The range and values to clean and update.

## Returns
- A `Promise` resolving to the update result from Google Sheets API.

## Example
```ts
await sdk.sanitizeSheetData({
  range: { sheetId: 'sheet1', range: 'A1:B2' },
  values: [[' Alice ', ' 25 '], ['Bob ', '30']],
});
