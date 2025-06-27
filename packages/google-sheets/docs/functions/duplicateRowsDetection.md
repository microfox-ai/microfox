# detectDuplicateRows

Detects fully duplicated rows from a specified sheet range.

## Parameters
- `range` (`{ sheetId: string, range: string }`): The range to check for duplicates.

## Returns
- A `Promise` resolving to an array of duplicate rows.

## Example
```ts
const duplicates = await sdk.detectDuplicateRows({ sheetId: 'sheet1', range: 'A1:B10' });
