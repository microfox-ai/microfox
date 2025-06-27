## Function: `createMCPClient`

Creates a lightweight Model Context Protocol (MCP) client to connect to an MCP server. This client is primarily used to convert tools between the MCP format and the AI SDK format, allowing the AI SDK to leverage tools from an MCP server.

### Purpose

To facilitate communication with an MCP server for tool conversion.

### Parameters

- `config`: `MCPClientConfig` - Configuration for the MCP client.
  - `transport`: `MCPTransportConfig | MCPTransport` - Configuration for the transport layer.
    - For Server-Sent Events (SSE), use `MCPTransportConfig`:
      - `type`: `'sse'`
      - `url`: `string` - The URL of the MCP server.
      - `headers`: `Record<string, string>` - Optional HTTP headers.
    - For custom transports, you can provide an object that implements the `MCPTransport` interface.
  - `name`: `string` - Optional client name. Defaults to `"ai-sdk-mcp-client"`.
  - `onUncaughtError`: `(error: unknown) => void` - Optional handler for uncaught errors.

### Return Value

A `Promise` that resolves to an `MCPClient` object with the following methods:

- `tools(options?: { schemas?: TOOL_SCHEMAS })`: `Promise<McpToolSet>` - Retrieves the available tools from the MCP server.
  - `options.schemas`: Optional schema definitions for compile-time type checking. If not provided, schemas are inferred from the server.
- `close()`: `Promise<void>` - Closes the connection to the MCP server.

### Example

```typescript
import { createMCPClient, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const mcpClient = await createMCPClient({
  transport: {
    type: 'sse',
    url: 'http://localhost:3000/sse',
    headers: {
      Authorization: 'Bearer <your-token>',
    },
  },
  onUncaughtError: error => {
    console.error('MCP Client Error:', error);
  },
});

try {
  const tools = await mcpClient.tools();

  const { text } = await generateText({
    model: openai.languageModel('gpt-4-turbo'),
    tools,
    prompt: 'Use the available tools to answer this question.',
  });

  console.log(text);
} finally {
  await mcpClient.close();
}
```

### Error Handling

- `MCPClientError` is thrown for initialization failures, protocol mismatches, or connection issues.
- `CallToolError` is propagated for tool execution errors.
- The `onUncaughtError` callback can be used for handling any other unexpected errors.
