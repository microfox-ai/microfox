import { ToolSet } from 'ai';
import { OpenAPIDoc } from './types';
import { createOpenApiToolset, OpenApiToolset } from './client/Toolset';

/**
 * Configuration for a single server, including its schema and how to connect to it.
 */
export interface ServerConfig {
  /**
   * A unique identifier for this server/tool source (e.g., 'github', 'jira').
   * This will be used to prefix tool names to prevent collisions.
   */
  id: string;

  /**
   * The base URL for the API.
   */
  baseUrl: string;

  /**
   * The OpenAPI schema document for this server.
   */
  docData: OpenAPIDoc;
}

/**
 * The client for managing and generating tools from multiple OpenAPI sources.
 */
export interface MixedToolsClient {
  /**
   * Generates a unified ToolSet from all configured servers.
   * @param options - Options to filter which tools are included.
   */
  tools(options?: {
    /**
     * A function to dynamically filter tools. It receives the tool's original
     * operationId and the serverId it belongs to. Return true to include the tool.
     * e.g., (toolName, serverId) => serverId === 'github' && toolName.startsWith('get')
     */
    filter?: (toolName: string, serverId: string) => boolean;
    /**
     * An alternative, simpler filter to include only tools whose names are in this array.
     */
    toolNames?: string[];
    /**
     * Forwards the `disableAllExecutions` option to the underlying clients,
     * requiring user approval before execution.
     */
    disableAllExecutions?: boolean;
  }): Promise<ToolSet>;
}

/**
 * Creates a client that can manage tools from multiple OpenAPI schemas.
 *
 * @param configs - An array of server configurations.
 * @returns A MixedToolsClient instance.
 */
export async function createMixedToolsClient(
  configs: ServerConfig[],
): Promise<MixedToolsClient> {
  // Create an individual OpenAPI client for each server configuration.
  const clients: Record<string, OpenApiToolset> = {};
  for (const config of configs) {
    // Use the async factory function to create and initialize each client.
    clients[config.id] = await createOpenApiToolset({
      // The factory expects the schema directly.
      schema: config.docData,
      baseUrl: config.baseUrl,
    });
  }

  return {
    async tools(options = {}) {
      let finalToolSet: ToolSet = {};

      for (const serverId in clients) {
        const client = clients[serverId];
        // The .tools() method returns a ToolResult object.
        const serverToolResult = await client.tools({
          disableAllExecutions: options.disableAllExecutions,
        });

        // The actual tools are in the .tools property of the result.
        const serverTools = serverToolResult.tools;

        for (const toolName in serverTools) {
          // Apply filtering logic
          if (options.filter && !options.filter(toolName, serverId)) {
            continue;
          }
          if (options.toolNames && !options.toolNames.includes(toolName)) {
            continue;
          }

          // Prefix the tool name with the server ID to guarantee uniqueness.
          const uniqueToolName = `${serverId}_${toolName}`;
          finalToolSet[uniqueToolName] = serverTools[toolName];
        }
      }

      return finalToolSet;
    },
  };
}
