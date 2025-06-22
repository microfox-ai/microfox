import {
  OpenAPIDoc,
  OpenAPIToolsClientOptions,
  ToolExecuteOptions,
  ToolOptions,
  ToolResult,
} from '../types';
import { parseSchema } from '../utils';
import { SingleOpenAPIToolsClient } from './SingleOpenAPIToolsClient';

/**
 * Client for interacting with APIs described by OpenAPI schemas
 * Provides methods for calling API operations and generating AI SDK-compatible tools
 */
export class OpenAPIToolsClient {
  private clients: SingleOpenAPIToolsClient[] = [];
  private initialized: boolean = false;

  constructor(
    options: OpenAPIToolsClientOptions | OpenAPIToolsClientOptions[],
  ) {
    // Convert single option to array for unified handling
    const optionsArray = Array.isArray(options) ? options : [options];

    // Create a client for each option
    optionsArray.forEach((opt, index) => {
      const schemName = (opt.schema as OpenAPIDoc).info?.title
        ?.toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '_');
      this.clients.push(
        new SingleOpenAPIToolsClient({
          ...opt,
          schema:
            typeof opt.schema === 'string'
              ? JSON.parse(opt.schema)
              : opt.schema,
          name:
            opt.name ??
            `${schemName?.length > 16 ? schemName.substring(0, 16) : schemName}`,
        }),
      );
    });
  }

  /**
   * Initialize all clients
   */
  async init(): Promise<OpenAPIToolsClient> {
    if (this.initialized) {
      return this;
    }

    try {
      // Initialize all clients in parallel, each will parse its schema
      await Promise.all(this.clients.map(client => client.init()));
      this.initialized = true;
      return this;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error during initialization';

      throw new Error(`Failed to initialize OpenAPI clients: ${errorMessage}`);
    }
  }

  /**
   * List all available API operations from all OpenAPI schemas
   */
  async listOperations() {
    if (!this.initialized) {
      throw new Error('Clients not initialized. Call init() first.');
    }

    // Get operations from all clients
    const allOperationsResults = await Promise.all(
      this.clients.map(client => client.listOperations()),
    );

    // Combine operations from all clients with properly namespaced IDs
    const operations = allOperationsResults.flatMap((result, index) => {
      const client = this.clients[index];
      if (!client) return []; // Skip if client is undefined

      return result.operations.map(op => ({
        ...op,
        // Add client name to ID to avoid conflicts
        id: `${client.getName()}-${op.id}`,
      }));
    });

    return { operations };
  }

  /**
   * Call a specific API operation from any client
   */
  async callOperation(
    id: string,
    args: Record<string, any> = {},
    options?: ToolExecuteOptions,
  ) {
    if (!this.initialized) {
      throw new Error('Clients not initialized. Call init() first.');
    }

    // Extract client name and operation ID
    const [clientName, operationId] = id.split(':');
    if (!clientName || !operationId) {
      throw new Error(
        `Invalid operation ID format: ${id}. Expected format: "clientName:operationId"`,
      );
    }

    // Find the client
    const client = this.clients.find(c => c.getName() === clientName);
    if (!client) {
      throw new Error(`Client "${clientName}" not found.`);
    }

    // Call the operation on the client
    return client.callOperation(operationId, args, options);
  }

  /**
   * Returns a set of tools generated from all OpenAPI schemas
   */
  async tools({
    schemas = 'automatic',
    validateParameters = false,
    disabledExecutions = [],
    disableAllExecutions = false,
  }: ToolOptions = {}): Promise<ToolResult> {
    if (!this.initialized) {
      throw new Error('Clients not initialized. Call init() first.');
    }

    // Get tools from all clients
    const allToolsResults = await Promise.all(
      this.clients.map(client =>
        client.tools({
          schemas,
          validateParameters, // Pass validation option to each client
          disabledExecutions,
          disableAllExecutions,
        }),
      ),
    );

    // Combine tools from all clients
    const combinedTools: ToolResult = {
      tools: {},
      executions: {},
      metadata: {},
    };

    allToolsResults.forEach((toolSet, index) => {
      const client = this.clients[index];
      if (!client) return; // Skip if client is undefined

      const clientName = client.getName();

      Object.entries(toolSet.tools).forEach(([key, tool]) => {
        // Create a namespaced key to avoid collisions
        const namespacedKey = `${clientName}-${key}`;

        // Add to tools
        combinedTools.tools[namespacedKey] = {
          ...tool,
          name: namespacedKey, // Update name to include namespace
        };

        // Add to executions if it exists
        if (toolSet.executions[key] && toolSet.metadata[key]) {
          combinedTools.executions[namespacedKey] = toolSet.executions[key];
          combinedTools.metadata[namespacedKey] = toolSet.metadata[key]!;
        }
      });
    });

    return combinedTools;
  }
}

/**
 * Create an OpenAPI client for interacting with an API described by an OpenAPI schema
 * The client can be used to call API operations directly or generate AI SDK-compatible tools
 *
 * @param options Client configuration options (single or array for multiple schemas)
 *   - schema: The OpenAPI schema configuration
 *   - baseUrl: Optional base URL to override schema servers
 *   - headers: Custom headers to include with every request
 *   - presetBodyFields: Fields to automatically include in request bodies (can be overridden by tool callers)
 *   - onError: Error handler function
 *   - name: Custom name for the client instance
 * @returns OpenAPIToolsClient instance
 */
export async function createOpenAPIToolsClient(
  options: OpenAPIToolsClientOptions | OpenAPIToolsClientOptions[],
): Promise<OpenAPIToolsClient> {
  try {
    // Handle single option or array of options
    const isArray = Array.isArray(options);

    if (isArray) {
      // For multiple schemas, parse each one independently
      const parsedOptions = await Promise.all(
        options.map(async opt => {
          const parsedSchema = await parseSchema(opt.schema);
          return {
            ...opt,
            schema: parsedSchema,
          };
        }),
      );

      // Create the client with parsed schemas
      const client = new OpenAPIToolsClient(parsedOptions);
      return await client.init();
    } else {
      // For a single schema
      const parsedSchema = await parseSchema(options.schema);
      const client = new OpenAPIToolsClient({
        ...options,
        schema: parsedSchema,
      });
      return await client.init();
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to create OpenAPI client: ${errorMessage}`);
    throw new Error(`Failed to create OpenAPI client: ${errorMessage}`);
  }
}
