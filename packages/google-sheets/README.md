# @microfox/google-sheets

A TypeScript SDK for interacting with Google Sheets.

## Project Overview

@microfox/google-sheets is a powerful and easy-to-use TypeScript SDK for interacting with Google Sheets. It provides a simple interface to perform operations such as reading, updating, appending, and clearing data in Google Sheets.

## Installation

Install the package using npm:

```bash
npm install @microfox/google-sheets
```

Or using yarn:

```bash
yarn add @microfox/google-sheets
```

## Usage

First, import the SDK and create an instance:

```typescript
import {
  createGoogleSheetsSdk,
  GoogleSheetsSdkConfig,
} from '@microfox/google-sheets';

const config: GoogleSheetsSdkConfig = {
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  refreshToken: 'YOUR_REFRESH_TOKEN',
};

const sheetsSdk = createGoogleSheetsSdk(config);
```

## Token Management Best Practices

The SDK provides built-in token validation and refresh capabilities. Here are the best practices for token management:

### 1. Validate Before Operations

Before performing any operations with Google Sheets, it's recommended to validate and refresh the access token:

```typescript
// Check token validity
const isValid = await sheetsSdk.validateAccessToken();

// Refresh if needed
if (!isValid) {
  await sheetsSdk.refreshAccessToken();
}

// Now proceed with your operations
const values = await sheetsSdk.getValues(range);
```

### 2. Automatic Token Management

While the SDK handles token refresh automatically in its internal `sendRequest` method, explicit token management can be useful when:
- You need to ensure token validity before a sequence of operations
- You want to handle token refresh errors separately from operation errors
- You need to log or monitor token refresh events

### 3. Error Handling

Implement proper error handling for token-related operations:

```typescript
try {
  // Validate token
  const isValid = await sheetsSdk.validateAccessToken();
  console.log('Token validation result:', isValid);
  
  if (!isValid) {
    await sheetsSdk.refreshAccessToken();
    console.log('Token refreshed successfully');
  }

  // Proceed with operations
  const values = await sheetsSdk.getValues(range);
} catch (error) {
  console.error('Token management error:', error);
  // Handle token-related errors appropriately
}
```

### 4. Token Storage Considerations

The refreshed token is stored in memory within the SDK instance. For long-running applications:
- Consider implementing a mechanism to persist the refreshed token
- Be aware that the token won't persist between SDK instance creations
- Handle cases where the refresh token itself might expire

## Understanding Sheet References

When working with Google Sheets, you need to understand three key concepts:

1. **Sheet ID**: A unique identifier for your Google Spreadsheet (found in the URL)
2. **Sheet Name**: The name of the specific tab within your spreadsheet
3. **Range**: The specific cells you want to work with

Here's how to use them:

```typescript
// Constants for better readability and maintenance
const SHEET_ID = '1234567890abcdefghijklmnopqrstuvwxyz'; // Your spreadsheet ID from the URL
const SHEET_NAME = 'Sales'; // The name of your sheet/tab
const RANGE = 'A1:B10'; // The range of cells you want to work with

// Combine them for use in the SDK
const sheetReference = {
  sheetId: SHEET_ID,
  range: `${SHEET_NAME}!${RANGE}`, // Format: "SheetName!Range"
};
```

### Range Notation Examples

The range parameter supports various formats:

```typescript
// Single cell
const singleCell = 'A1';

// Range of cells
const cellRange = 'A1:B10';

// Entire column
const entireColumn = 'A:A';

// Entire row
const entireRow = '1:1';

// Multiple columns
const multipleColumns = 'A:C';

// Multiple rows
const multipleRows = '1:5';
```

## API Reference

### `createGoogleSheetsSdk(config: GoogleSheetsSdkConfig): GoogleSheetsSdk`

Creates an instance of the Google Sheets SDK.

### `GoogleSheetsSdk`

#### `getValues(range: Range): Promise<any[][]>`

Gets values from a range in a Google Sheet.

#### `updateValues(input: UpdateValuesInput): Promise<ApiResponse>`

Updates values in a range of a Google Sheet.

#### `appendValues(input: AppendValuesInput): Promise<ApiResponse>`

Appends values to a Google Sheet.

#### `clearValues(input: ClearValuesInput): Promise<ApiResponse>`

Clears values from a range in a Google Sheet.

#### `batchGetValues(sheetId: string, ranges: string[]): Promise<any[][][]>`

Batch gets values from multiple ranges in a Google Sheet.

#### `batchUpdateValues(sheetId: string, inputs: UpdateValuesInput[]): Promise<ApiResponse[]>`

Batch updates values in multiple ranges of a Google Sheet.

#### `batchClearValues(sheetId: string, ranges: string[]): Promise<ApiResponse>`

Batch clears values from multiple ranges in a Google Sheet.

#### `validateAccessToken(): Promise<boolean>`

Validates the access token.

#### `refreshAccessToken(): Promise<void>`

Refreshes the access token.

## Examples

### Reading Values with Token Management

```typescript
// Define your constants
const SHEET_ID = 'your-spreadsheet-id';
const SHEET_NAME = 'Sales';
const RANGE = 'A1:B10';

// Create the range object
const range = {
  sheetId: SHEET_ID,
  range: `${SHEET_NAME}!${RANGE}`,
};

// Validate token before operation
const isValid = await sheetsSdk.validateAccessToken();
if (!isValid) {
  await sheetsSdk.refreshAccessToken();
}

// Get the values
const values = await sheetsSdk.getValues(range);
console.log(values);
```

### Updating Values

```typescript
// Define your constants
const SHEET_ID = 'your-spreadsheet-id';
const SHEET_NAME = 'Inventory';
const RANGE = 'A1:B2';

// Create the update input
const updateInput = {
  range: {
    sheetId: SHEET_ID,
    range: `${SHEET_NAME}!${RANGE}`,
  },
  values: [
    ['New Value 1', 'New Value 2'],
    ['New Value 3', 'New Value 4'],
  ],
};

// Update the values
const response = await sheetsSdk.updateValues(updateInput);
console.log(response);
```

### Appending Values

```typescript
// Define your constants
const SHEET_ID = 'your-spreadsheet-id';
const SHEET_NAME = 'Customers';
const RANGE = 'A:B'; // Append to columns A and B

// Create the append input
const appendInput = {
  range: {
    sheetId: SHEET_ID,
    range: `${SHEET_NAME}!${RANGE}`,
  },
  values: [['Appended Value 1', 'Appended Value 2']],
};

// Append the values
const response = await sheetsSdk.appendValues(appendInput);
console.log(response);
```

### Clearing Values

```typescript
// Define your constants
const SHEET_ID = 'your-spreadsheet-id';
const SHEET_NAME = 'Sales';
const RANGE = 'A1:B10';

// Create the clear input
const clearInput = {
  sheetId: SHEET_ID,
  range: `${SHEET_NAME}!${RANGE}`,
};

// Clear the values
const response = await sheetsSdk.clearValues(clearInput);
console.log(response);
```

## Configuration

The SDK requires the following configuration:

```typescript
interface GoogleSheetsSdkConfig {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
}
```

Ensure you have obtained these credentials from the Google Cloud Console and have the necessary permissions to access Google Sheets API.

## Dependencies

- @microfox/google-oauth: For handling OAuth authentication with Google
- zod: For runtime type checking and validation
