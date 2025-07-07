# @microfox/tool-core

A TypeScript SDK for Tool Core that provides a simple and reusable way to handle API Gateway events, decrypt environment variables, extract arguments, and execute functions.

## Installation

```bash
npm install @microfox/tool-core
```

## Features

- **Environment Variable Decryption**: Securely decrypt environment variables from request headers
- **Argument Extraction**: Parse and extract function arguments from request bodies
- **Function Resolution**: Map URL paths to SDK functions
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **API Response Creation**: Utility function for creating standardized API responses

## Quick Start

```typescript
import { ToolParse, createApiResponse } from '@microfox/tool-core';

// Define your SDK map
const sdkMap = {
  getUser: async (id: string) => ({ id, name: 'John Doe' }),
  createUser: async (name: string, email: string) => ({
    id: '123',
    name,
    email,
  }),
};

// Create handler instance
const handler = new ToolParse({
  encryptionKey: process.env.ENCRYPTION_KEY,
});

// Use in your Lambda function
export const lambdaHandler = async (event: APIGatewayEvent) => {
  try {
    // Populate environment variables from encrypted headers
    handler.populateEnvVars(event);

    // Extract arguments from request body
    const args = handler.extractArguments(event);

    // Extract function from SDK map
    const fn = handler.extractFunction(sdkMap, event);

    // Execute the function
    const result = await handler.executeFunction(fn, args);

    return createApiResponse(200, { success: true, data: result });
  } catch (error: any) {
    return createApiResponse(error.statusCode || 500, {
      success: false,
      error: error.message,
    });
  }
};
```

## API Reference

### ToolParse

The main class that handles all the core functionality.

#### Constructor

```typescript
new ToolParse(options?: ToolParseOptions)
```

**Options:**

- `encryptionKey?: string` - Encryption key for decrypting environment variables
- `keyFormat?: 'base64' | 'hex' | 'utf8'` - Format of the encryption key (default: 'base64')
- `encryptionAlgo?: 'aes-256-gcm' | 'aes-256-cbc'` - Encryption algorithm (default: 'aes-256-gcm')
- `hashAlgo?: 'sha256' | 'sha512'` - Hash algorithm (default: 'sha256')
- `outputEncoding?: 'base64url' | 'base64' | 'hex'` - Output encoding (default: 'base64url')

#### Methods

##### `populateEnvVars(event: APIGatewayEvent): void`

Decrypts and populates environment variables from the `x-auth-secrets` header.

**Throws:**

- `BadRequestError` - If `x-auth-secrets` header is missing or decryption fails

##### `extractArguments(event: APIGatewayEvent): any[]`

Extracts function arguments from the request body. Supports both `body.arguments` and `arguments` formats.

**Returns:** Array of arguments

**Throws:**

- `BadRequestError` - If request body is invalid JSON or arguments are malformed

##### `extractFunction(sdkMap: Record<string, any>, event: APIGatewayEvent, path?: string): any`

Extracts the function from the SDK map based on the path parameter.

**Parameters:**

- `sdkMap` - Object mapping function names to functions
- `event` - API Gateway event
- `path` - Path parameter name (default: 'functionName')

**Returns:** Function from the SDK map

**Throws:**

- `BadRequestError` - If path parameter is missing
- `NotFoundError` - If function is not found in SDK map

##### `executeFunction(fn: any, args: any[]): Promise<any>`

Executes the function with the provided arguments.

**Returns:** Promise resolving to function result

**Throws:**

- `InternalServerError` - If function execution fails

### Error Classes

#### `ApiError`

Base error class with status code and operational flag.

#### `BadRequestError` (400)

Thrown for invalid requests, missing headers, or malformed data.

#### `UnauthorizedError` (401)

Thrown for authentication/authorization failures.

#### `NotFoundError` (404)

Thrown when requested resource is not found.

#### `InternalServerError` (500)

Thrown for internal server errors.

### Utilities

#### `createApiResponse(statusCode: number, body: any)`

Creates a standardized API Gateway response.

**Returns:**

```typescript
{
  statusCode: number,
  headers: { 'Content-Type': 'application/json' },
  body: string // JSON stringified body
}
```

## Usage Examples

### Basic Usage

```typescript
import { ToolParse, createApiResponse } from '@microfox/tool-core';

const handler = new ToolParse();
handler.populateEnvVars(event);
const args = handler.extractArguments(event);
const fn = handler.extractFunction(sdkMap, event);
const result = await handler.executeFunction(fn, args);
```

### Custom Configuration

```typescript
const handler = new ToolParse({
  encryptionKey: 'your-encryption-key',
  keyFormat: 'hex',
  encryptionAlgo: 'aes-256-cbc',
  hashAlgo: 'sha512',
  outputEncoding: 'base64',
});
```

### Error Handling

```typescript
try {
  const result = await handler.executeFunction(fn, args);
  return createApiResponse(200, { success: true, data: result });
} catch (error: any) {
  if (error instanceof BadRequestError) {
    return createApiResponse(400, { error: error.message });
  }
  if (error instanceof NotFoundError) {
    return createApiResponse(404, { error: error.message });
  }
  return createApiResponse(500, { error: 'Internal server error' });
}
```

## Dependencies

- `@microfox/crypto-sdk` - For encryption/decryption functionality
- `dotenv` - For environment variable management
- `aws-lambda` - For TypeScript types

## License

MIT
