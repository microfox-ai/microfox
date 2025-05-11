## Function: `experimental_createMCPClient`

Creates a lightweight Model Context Protocol (MCP) client that connects to an MCP server. The client's primary purpose is tool conversion between MCP tools and AI SDK tools.  It currently does not support accepting notifications from an MCP server, and custom configuration of the client.

**Purpose:**

This function facilitates communication with an MCP server, primarily for converting tools between the MCP format and the AI SDK format.  This allows the AI SDK to utilize tools provided by an MCP server.

**Parameters:**

* `config`: object<MCPClientConfig> - Configuration for the MCP client.
    * `transport`: object<TransportConfig> - Configuration for the message transport layer. This can be one of two types: `MCPTransport` or `McpSSEServerConfig`.
        * **Type 1: `MCPTransport`**
            * `start`: function -  A method that starts the transport. Returns a `Promise<void>`.
            * `send`: function - A method that sends a message through the transport. Takes a `JSONRPCMessage` object as input and returns a `Promise<void>`.
            * `close`: function - A method that closes the transport. Returns a `Promise<void>`.
            * `onclose`: function - A method that is called when the transport is closed.
            * `onerror`: function - A method that is called when the transport encounters an error. Takes an `Error` object as input.
            * `onmessage`: function - A method that is called when the transport receives a message. Takes a `JSONRPCMessage` object as input.
        * **Type 2: `McpSSEServerConfig`**
            * `type`: string - Use Server-Sent Events for communication. Must be set to `'sse'`.
            * `url`: string - URL of the MCP server.
            * `headers`: optional object<string, string> - Additional HTTP headers to be sent with requests.
            * `name`: optional string - Client name. Defaults to "ai-sdk-mcp-client".
            * `onUncaughtError`: optional function - Handler for uncaught errors. Takes an `unknown` type as input.


**Return Value:**

Returns a `Promise` that resolves to an `MCPClient` object with the following methods:

* `tools`: async function - Gets the tools available from the MCP server. Takes an optional `options` object as input.
    * `options`: optional object
        * `schemas`: optional `TOOL_SCHEMAS` - Schema definitions for compile-time type checking. When not provided, schemas are inferred from the server.
* `close`: async function - Closes the connection to the MCP server and cleans up resources. Returns `void`.


**Examples:**

```typescript
// Example 1: Using stdio transport
import { experimental_createMCPClient, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

try {
  const client = await experimental_createMCPClient({
    transport: {
      type: 'stdio',
      command: 'node server.js', // Example command
    },
  });

  const tools = await client.tools();

  const response = await generateText({
    model: openai('gpt-4o-mini'),
    tools,
    messages: [{ role: 'user', content: 'Query the data' }],
  });

  console.log(response);
} finally {
  await client.close();
}


// Example 2: Using SSE transport
import { experimental_createMCPClient, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

try {
  const client = await experimental_createMCPClient({
    transport: {
      type: 'sse',
      url: 'http://localhost:3000/sse', // Example URL
      headers: {
        'Authorization': 'Bearer <token>' // Example header
      },
      name: 'my-mcp-client',
      onUncaughtError: (error) => {
        console.error('Uncaught error:', error);
      }
    },
  });

  const tools = await client.tools({ schemas: { /* TOOL_SCHEMAS definition */ } });

  const response = await generateText({
    model: openai('gpt-4o-mini'),
    tools,
    messages: [{ role: 'user', content: 'Query the data' }],
  });

  console.log(response);
} finally {
  await client.close();
}
```

**Error Handling:**

The client throws `MCPClientError` for:

* Client initialization failures
* Protocol version mismatches
* Missing server capabilities
* Connection failures

For tool execution, errors are propagated as `CallToolError` errors.

For unknown errors, the client exposes an `onUncaughtError` callback that can be used to manually log or handle errors that are not covered by known error types.
