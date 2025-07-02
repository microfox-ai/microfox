# @microfox/tool-kit

This package provides a way to create a tool set from an OpenAPI schema that can be used with AI models.

## Installation

```bash
npm install @microfox/tool-kit
```

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

Now, create the client and the tool set. The `disableAllExecutions: true` option configures the tools to require user approval before execution.

```javascript
const thisClient = await createOpenAPIToolsClient({
  schema: docData,
  baseUrl: baseUrl,
});

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

      Before calling the above tools, make sure you give some contextual text info to the user, on why you need to use this tool, as all the above tools require user permissions. after outputting the hint message, you can directly execute the tool you need to call.

      If the tool has a lot of information, output into a neat markdown format.
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
