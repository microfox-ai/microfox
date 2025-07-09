# @microfox/tool-kit

This package provides a powerful way to convert OpenAPI schemas into Model Context Protocol (MCP) servers that can be used with AI models. It automatically generates tools from your API specification while providing built-in support for OAuth authentication and Human-in-the-Loop (HITL) execution control.

## Key Features

- **OpenAPI to MCP Conversion**: Seamlessly convert any OpenAPI 3.0 schema into executable MCP tools
- **OAuth Authentication**: Built-in support for OAuth flows with automatic token management
- **Human-in-the-Loop (HITL)**: Configurable execution control that requires user approval before API calls
- **Flexible Authentication**: Multiple authentication strategies including API keys, Bearer tokens, and custom providers
- **Dynamic Credential Management**: Runtime credential fetching and token refresh capabilities
- **Specification-Driven**: Define authentication providers directly in your MCP specification for maximum portability

## Installation

```bash
npm install @microfox/tool-kit
```

## MCP Server Capabilities

The `@microfox/tool-kit` transforms your OpenAPI schemas into fully functional MCP servers that can:

### OAuth Integration

- **Automatic OAuth Flow Handling**: Built-in support for OAuth 2.0 authorization flows
- **Token Management**: Automatic token refresh and storage
- **Multiple OAuth Providers**: Support for various OAuth providers (Google, GitHub, Slack, etc.)
- **Secure Credential Storage**: Safe handling of access tokens and refresh tokens

### Human-in-the-Loop (HITL) Control

- **Execution Approval**: Require user confirmation before executing API calls
- **Granular Control**: Configure HITL at the client, toolset, or individual tool level
- **Contextual Information**: Provide users with context about why a tool needs to be called
- **Audit Trail**: Track all tool executions and user approvals

### MCP Compliance

- **Standard Protocol**: Full compliance with Model Context Protocol specifications
- **Tool Discovery**: Automatic tool registration and discovery
- **Schema Validation**: Built-in validation of API schemas and responses
- **Error Handling**: Comprehensive error handling and reporting

## Usage

First, you need to import `createOpenAPIToolsClient` from the package and a streaming text utility from your preferred AI library. This example uses a generic `streamText` function.

```javascript
import { createOpenAPIToolsClient } from '@microfox/tool-kit';
import { streamText } from 'ai'; // or 'google-generative-ai', etc.
import { models } from 'some-ai-library'; // Placeholder for actual library
```

You'll need an OpenAPI schema object and the base URL for your API.

```javascript
const docData = {
  // Your OpenAPI schema here
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
  },
  paths: {
    '/users/{userId}': {
      get: {
        summary: 'Get a user by ID',
        operationId: 'getUserById',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'A user object',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const baseUrl = 'https://api.example.com';
```

Now, create the client and the tool set. The `disableAllExecutions: true` option enables Human-in-the-Loop (HITL) control, requiring user approval before any API execution.

```javascript
const thisClient = await createOpenAPIToolsClient({
  schema: docData,
  baseUrl: baseUrl,
  // Optional: Configure OAuth authentication at client level
  getAuth: async (packageName, providerOptions, toolOptions) => {
    // Your OAuth token fetching logic here
    const token = await getOAuthToken();
    return {
      strategy: 'bearer',
      token: token,
    };
  },
});

// Enable HITL for this toolset - requires user approval before execution
const toolSet = await thisClient.tools({ disableAllExecutions: true });
```

The `toolSet.tools` object can then be passed to your AI model.

Here's a full example of how to use it with `streamText`:

```javascript
import { createOpenAPIToolsClient } from '@microfox/tool-kit';
import { streamText } from 'ai'; // or your preferred library
import { models } from 'some-ai-library'; // Placeholder

async function main() {
  const docData = {
    // A sample OpenAPI schema
    openapi: '3.0.0',
    info: {
      title: 'Sample API',
      version: '1.0.0',
    },
    paths: {
      '/example': {
        get: {
          summary: 'An example endpoint',
          operationId: 'getExample',
          responses: {
            200: {
              description: 'Successful response',
            },
          },
        },
      },
    },
  };

  const baseUrl = 'https://api.example.com';

  const thisClient = await createOpenAPIToolsClient({
    schema: docData,
    baseUrl: baseUrl,
  });

  const toolSet = await thisClient.tools({ disableAllExecutions: true });

  const taskInstanceMeta = { id: 'task-123', name: 'Example Task' };
  const processedMessages = [
    { role: 'user', content: 'Can you call the example endpoint?' },
  ];

  const msg = streamText({
    model: models.googleGeminiPro, // or your preferred model
    system: `
      You are a helpful assistant that can answer questions in regards to the current task.

      The entire task Information is here : ${JSON.stringify(taskInstanceMeta)}

      Call the tools as needed in order to answer the users query or perform user requested actions.
      Available tools: ${Object.keys(toolSet.tools).join(', ')}

      IMPORTANT: All tools require Human-in-the-Loop (HITL) approval. Before calling any tool:
      1. Explain to the user why you need to use the tool and what action you're about to perform
      2. Provide context about the API endpoint and expected outcome
      3. Wait for user approval before proceeding with the tool execution

      If the tool returns a lot of information, format it into a neat markdown structure for better readability.
    `,
    messages: processedMessages,
    tools: toolSet.tools,
    toolChoice: 'auto',
    maxSteps: 10,
    onError: error => {
      console.error(error);
    },
  });

  // Stream the response to the console
  for await (const chunk of msg.textStream) {
    process.stdout.write(chunk);
  }
  // ... existing code ...
  for await (const chunk of msg.textStream) {
    process.stdout.write(chunk);
  }
}

main().catch(console.error);
```

## Human-in-the-Loop (HITL) Configuration

The `@microfox/tool-kit` provides flexible Human-in-the-Loop control to ensure user oversight of AI-driven API calls.

### Enabling HITL

```javascript
// Enable HITL for all tools in a toolset
const toolSet = await thisClient.tools({ disableAllExecutions: true });

// Enable HITL for specific operations only
const toolSet = await thisClient.tools({
  disableAllExecutions: false,
  disableExecutions: ['sensitiveOperation', 'writeOperation'],
});
```

### HITL Best Practices

1. **Provide Context**: Always explain why a tool needs to be called
2. **Show Expected Outcomes**: Describe what the API call will accomplish
3. **Handle Rejections**: Gracefully handle when users reject tool executions
4. **Audit Trail**: Log all HITL decisions for compliance and debugging

### Custom HITL Handlers

```javascript
const toolSet = await thisClient.tools({
  disableAllExecutions: true,
  onToolExecution: async (toolName, parameters, context) => {
    // Custom logic before tool execution
    console.log(`Requesting approval for: ${toolName}`);

    // Your custom approval logic here
    const approved = await requestUserApproval(toolName, parameters);

    if (!approved) {
      throw new Error('User rejected tool execution');
    }

    return true; // Proceed with execution
  },
});
```

## Authentication

The `@microfox/tool-kit` provides a flexible and powerful system for handling authentication. You can provide credentials at the client level, override them for specific toolsets, or even define authentication providers directly within your MCP specification for maximum portability.

The system resolves authentication credentials with the following priority:

1.  **Specification-Defined (`x-auth-provider`)**: A provider defined in the MCP spec that makes a pre-flight call to fetch credentials.
2.  **Tool-level Dynamic (`getAuth`)**: A function provided to the `.tools()` method.
3.  **Tool-level Static (`auth`)**: An object provided to the `.tools()` method.
4.  **Client-level Dynamic (`getAuth`)**: A function provided when creating the client.
5.  **Client-level Static (`auth`)**: An object provided when creating the client.

---

### 1. Client-Level Authentication

You can provide static or dynamic authentication credentials when you create the client. These will be used for all tools generated by that client unless overridden.

**Static API Key (Client-Level)**

```javascript
import { createOpenAPIToolsClient } from '@microfox/tool-kit';

const thisClient = await createOpenAPIToolsClient({
  schema: docData,
  baseUrl: baseUrl,
  // Provide a static auth object
  auth: {
    strategy: 'apikey',
    variables: [{ key: 'my_api_key', value: 'SECRET_KEY' }],
  },
});
```

**Dynamic Token Fetching (Client-Level)**

Provide an async `getAuth` function to fetch credentials at runtime. This is ideal for OAuth tokens or other credentials that need to be refreshed.

```javascript
import { createOpenAPIToolsClient } from '@microfox/tool-kit';

const thisClient = await createOpenAPIToolsClient({
  schema: docData,
  baseUrl: baseUrl,
  // Provide a function to fetch auth dynamically
  getAuth: async (packageName, providerOptions, toolOptions) => {
    console.log(
      `Fetching token for ${packageName}, path: ${providerOptions.path}, toolCallId: ${toolOptions?.toolCallId}`,
    );
    const token = await getFreshToken(); // Your token fetching logic
    return {
      strategy: 'bearer',
      token: token,
    };
  },
});
```

---

### 2. Tool-Level Authentication Overrides

You can override the client-level authentication for a specific set of tools by passing `auth` or `getAuth` to the `.tools()` method.

```javascript
// Client has no default auth
const thisClient = await createOpenAPIToolsClient({
  schema: docData,
  baseUrl: baseUrl,
});

// Provide auth only for this specific toolset
const toolSet = await thisClient.tools({
  auth: {
    strategy: 'apikey',
    variables: [{ key: 'temp_key', value: 'TEMP_SECRET' }],
  },
});
```

---

### 3. Specification-Defined Authentication (`mcp_1.0.2` and higher)

For the most portable and self-contained tools, you can define authentication providers directly within your MCP specification.

The client will automatically detect these providers, make a pre-flight API call with a contextual request body to fetch the credentials, and inject them into the actual tool call.

The request body sent to the auth provider contains:

- `packageName`: The `packageName` from the spec's `info` object.
- `providerOptions`: An object containing the `constructor` (client name from the path) and the full `path` of the operation being called.
- `toolOptions`: An object containing the `toolCallId` if available.

**Example `mcp_1.0.2.json`:**

```json
{
  "mcpVersion": "1.0.2",
  "info": { "...": "..." },
  "servers": ["..."],

  "components": {
    "x-auth-providers": {
      "defaultProvider": {
        "path": "/auth/getToken",
        "method": "POST",
        "responseMapping": {
          "strategy": "'apikey'",
          "variables": [{ "key": "'default_api_key'", "value": "$.token" }]
        }
      },
      "specificProvider": {
        "path": "/auth/getSpecificToken",
        "method": "POST",
        "responseMapping": {
          "strategy": "'apikey'",
          "variables": [
            { "key": "'specific_api_key'", "value": "$.specific_key" }
          ]
        }
      }
    }
  },

  "auth": "defaultProvider",

  "paths": {
    "/MyClient/myMethod": {
      "post": {
        "operationId": "myClient.myMethod",
        "auth": "specificProvider",
        "...": "..."
      }
    },
    "/MyClient/anotherMethod": {
      "post": {
        "operationId": "myClient.anotherMethod",
        "...": "..."
      }
    }
  }
}
```

When you create a client with this schema, no `auth` options are needed in the code. The tool-kit handles it automatically.

```javascript
// No auth needed here! It's defined in the schema.
const thisClient = await createOpenAPIToolsClient({
  schema: myMcpSchema,
  baseUrl: baseUrl,
});

// The tools are automatically auth-aware
const toolSet = await thisClient.tools();
```
