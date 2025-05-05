## Function: `createRestApiTool`

Creates a REST API tool with the provided configuration.

**Purpose:**
Creates a new RestApiTool instance for interacting with REST APIs.

**Parameters:**
- `config`: object - Configuration for the REST API tool.
  - `name`: string - The name of the tool.
  - `description`: string (optional) - A description of the tool.
  - `isLongRunning`: boolean - Whether the tool is long-running.
  - `baseUrl`: string - The base URL of the API.
  - `method`: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" - The HTTP method to use.
  - `path`: string - The path of the API endpoint.
  - `authScheme`: AuthScheme (optional) - The authentication scheme to use.
  - `authCredential`: AuthCredential (optional) - The authentication credentials.

**Return Value:**
- `RestApiTool` - The created REST API tool.

**Examples:**
```typescript
// Example 1: Minimal usage
const restApiTool = sdk.createRestApiTool({
  name: 'myRestApiTool',
  isLongRunning: false,
  baseUrl: 'https://api.example.com',
  method: 'GET',
  path: '/users',
});

// Example 2: With optional parameters
const restApiToolWithOptions = sdk.createRestApiTool({
  name: 'myRestApiToolWithOptions',
  description: 'A REST API tool with options',
  isLongRunning: true,
  baseUrl: 'https://api.example.com',
  method: 'POST',
  path: '/products',
  authScheme: 'API_KEY',
  authCredential: { authType: 'API_KEY' },
});
```