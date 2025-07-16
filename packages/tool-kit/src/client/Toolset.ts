import {
  UIMessage as Message,
  StopCondition,
  ToolCallPart,
  ToolUIPart,
  UIMessageStreamWriter,
} from 'ai';
import { ReadableStream } from 'stream/web';
import {
  AuthObject,
  OpenAPIDoc,
  OpenAPIToolsClientOptions,
  PendingToolContext,
  ToolOptions,
  ToolResult,
} from '../types';
import { parseSchema } from '../utils';
import { OpenApiMCP } from './OpenAPiMcp';
import { AgentUi } from '@microfox/types';

const FAKE_HUMAN_INTERACTION_TOOL_NAME = 'FAKE_HUMAN_INTERACTION';

/**
 * Client for interacting with APIs described by OpenAPI schemas
 * Provides methods for calling API operations and generating AI SDK-compatible tools
 */
export class OpenApiToolset {
  private clients: OpenApiMCP[] = [];
  private initialized: boolean = false;
  private pendingTools = new Map<string, PendingToolContext>();
  private options: OpenAPIToolsClientOptions | OpenAPIToolsClientOptions[];

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
        new OpenApiMCP({
          ...opt,
          baseUrl:
            typeof opt.schema === 'object' && 'url' in opt.schema
              ? opt.schema.url
              : (opt.baseUrl ?? ''),
          schema:
            typeof opt.schema === 'string'
              ? JSON.parse(opt.schema)
              : opt.schema,
          name:
            opt.name ??
            `${schemName?.length > 16 ? schemName.substring(0, 16) : schemName}`,
          getHumanIntervention: opt.getHumanIntervention,
        }),
      );
    });
    this.options = options;
  }

  /**
   * Add a tool to the pending map
   */
  private addPendingTool(context: PendingToolContext) {
    this.pendingTools.set(context.originalToolCallId, context);
  }

  /**
   * Find and remove a pending tool from the map
   */
  private consumePendingTool(
    toolCallId: string,
  ): PendingToolContext | undefined {
    const context = this.pendingTools.get(toolCallId);
    if (context) {
      this.pendingTools.delete(toolCallId);
    }
    return context;
  }

  /**
   * Initialize all clients
   */
  async init(): Promise<OpenApiToolset> {
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
        id: `${client.getName()}AsTool${op.id}`,
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
    options?: any,
  ) {
    if (!this.initialized) {
      throw new Error('Clients not initialized. Call init() first.');
    }

    // Extract client name and operation ID
    const [clientName, operationId] = id.split('AsTool');
    if (!clientName || !operationId) {
      throw new Error(
        `Invalid operation ID format: ${id}. Expected format: "clientNameAsTooloperationId"`,
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
   * Generates a combined system prompt from all OpenAPI schemas.
   */
  generateSystemPrompt(): string {
    if (!this.initialized) {
      throw new Error('Clients not initialized. Call init() first.');
    }

    const allPrompts: string[] = [];

    this.clients.forEach(client => {
      const { global, operations } = client.getSystemPrompts();
      if (global) {
        allPrompts.push(global);
      }
      const clientName = client.getName();
      operations.forEach((prompt: string, toolName: string) => {
        const namespacedKey = `${clientName}AsTool${toolName}`;
        allPrompts.push(`[${namespacedKey}]: ${prompt}`);
      });
    });

    return allPrompts.filter(p => p && p.trim()).join('\n\n');
  }

  /**
   * Returns a set of tools generated from all OpenAPI schemas
   */
  async tools({
    schemas = 'automatic',
    validateParameters = false,
    disabledExecutions = [],
    disableAllExecutions = false,
    auth,
    getAuth,
    getHumanIntervention,
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
          auth,
          getAuth,
          getHumanIntervention,
        }),
      ),
    );

    // Combine tools from all clients
    const combinedTools: ToolResult = {
      tools: {},
      executions: {},
      metadata: {},
      uiMaps: {},
    };

    allToolsResults.forEach((toolSet, index) => {
      const client = this.clients[index];
      if (!client) return; // Skip if client is undefined

      const clientName = client.getName();

      Object.entries(toolSet.tools).forEach(([key, tool]) => {
        // Create a namespaced key to avoid collisions
        const namespacedKey = `${clientName}AsTool${key}`;

        // Add to tools
        combinedTools.tools[namespacedKey] = {
          ...tool,
          clientName,
          _id: namespacedKey, // Update name to include namespace
        };

        // Add to executions if it exists
        if (toolSet.executions[key] && toolSet.metadata[key]) {
          combinedTools.executions[namespacedKey] = toolSet.executions[key];
          combinedTools.metadata[namespacedKey] = toolSet.metadata[key]!;
        }
      });
      if (toolSet.uiMaps) {
        Object.entries(toolSet.uiMaps).forEach(([key, uiMap]) => {
          const namespacedKey = `${clientName}AsTool${key}`;
          if (combinedTools.uiMaps) {
            combinedTools.uiMaps[namespacedKey] = uiMap;
          }
        });
      }
    });

    return combinedTools;
  }

  /**
   * Parses incoming messages for HITL responses, resumes the original tool,
   * and returns a cleaned message history.
   * @param messages The full message history.
   * @returns A promise that resolves to the processed message history.
   */
  async processHitlToolResult(
    messages: Message[],
    options: {
      dataStream?: UIMessageStreamWriter;
      inserAuthVariables?: (auth: AuthObject) => Promise<AuthObject>;
      mutateOutput?: (
        output: any,
        { part, uiMapper }: { part: ToolUIPart; uiMapper?: AgentUi },
      ) => Promise<any>;
    },
  ): Promise<Message[]> {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return messages;
    const parts = lastMessage.parts;
    if (!parts) return messages;

    const thisClientTools = await this.tools();

    const processedParts = await Promise.all(
      parts.map(async (part: any) => {
        // Only process tool invocations parts
        if (!part.type.startsWith('tool-')) return part;

        const toolName = (part as any).type.replace('tool-', '');

        // Only continue if we have an execute function for the tool (meaning it requires confirmation) and it's in a 'result' state
        if (!(toolName in thisClientTools.executions)) return part;

        let result;
        let _input = part.input;

        if (
          (part as any).state === 'output-available' &&
          'approved' in (part as any).output
        ) {
          //console.log('approved', (part as any).output.approved);
          const correspondingCall = thisClientTools.executions[toolName];
          const uiMap = thisClientTools.uiMaps?.[toolName];
          if (!correspondingCall) {
            result = 'Error: No execute function found on tool';
          } else if ((part as any).output.approved) {
            let _auth = (part as any).output.auth;
            if (options.inserAuthVariables && _auth) {
              _auth = await options.inserAuthVariables(_auth);
            }
            if ((part as any).output === 'approved') {
              _input = (part as any).output.mutatedInput;
            }
            //console.log('calling tool', part.input);
            result = await correspondingCall(_input as any, {
              toolCallId: (part as any).toolCallId,
              messages: messages as any[],
              ...(_auth ? { auth: _auth } : {}),
            });
            if (options.mutateOutput) {
              result = await options.mutateOutput(result, {
                part,
                uiMapper: uiMap,
              });
            }
            result.toolSummary = thisClientTools.metadata[toolName]?.summary;
          } else {
            result = 'Error: User denied access to tool execution';
          }
        }

        // Forward updated tool result to the client.
        if (options.dataStream && result) {
          options.dataStream.write({
            type: 'tool-output-available',
            toolCallId: (part as any).toolCallId,
            output: result as any,
            //providerMetadata: {},
          });
        }

        // Return updated toolInvocation with the actual result.
        return {
          ...part,
          input: _input,
          state: 'output-available',
          output: result as any,
        };
      }),
    );

    // Finally return the processed messages
    return [
      ...messages.slice(0, -1),
      { ...lastMessage, parts: processedParts },
    ];
  }

  isHitlStep(): StopCondition<any> {
    return async s => {
      const lastStep = s.steps[s.steps.length - 1];
      if (lastStep?.toolResults && lastStep?.toolResults?.length > 0) {
        const allToolResults = lastStep.toolResults;
        if (allToolResults.find(t => t.output._humanIntervention && t)) {
          return true;
        }
      }
      return false;
    };
  }

  /**
   * Processes a stream from `streamText`, transforming paused tool markers
   * into `FAKE_HUMAN_INTERACTION` tool calls on the fly.
   * @param resultStream The stream from `streamText`.
   * @returns A new stream with HITL logic applied.
   */
  stream(
    resultStream: ReadableStream,
    dataStream?: UIMessageStreamWriter,
  ): ReadableStream {
    const client = this;
    const [streamForProcessing, streamToReturn] = resultStream.tee();

    (async () => {
      const reader = streamForProcessing.getReader();
      try {
        while (true) {
          const { done, value: part } = await reader.read();
          if (done) {
            break;
          }

          if (
            part.type === 'tool-result' &&
            (part.toolResult.result as any)?._humanIntervention === true
          ) {
            const { toolCallId, result } = part.toolResult;
            const pendingTool = client.pendingTools.get(toolCallId);

            if (pendingTool && dataStream) {
              const interventionArgs = (result as any).args ?? {};
              const fakeToolCallPart = {
                type: 'tool-call',
                toolCallId: `${toolCallId}-human-intervention`,
                toolName: FAKE_HUMAN_INTERACTION_TOOL_NAME,
                args: {
                  originalToolCallId: toolCallId,
                  originalToolName: pendingTool.toolName,
                  ...interventionArgs,
                },
              };

              dataStream.write(fakeToolCallPart as any);
            }
          }
        }
      } catch (error) {
        // console.error('Error processing stream for HITL:', error);
      }
    })();

    return streamToReturn;
  }

  isHumanLoop(part: ToolCallPart): boolean {
    return (
      part.toolName === FAKE_HUMAN_INTERACTION_TOOL_NAME &&
      (part as any).state === 'call'
    );
  }

  ui(part: ToolCallPart): any {
    if (!this.isHumanLoop(part)) {
      return null;
    }
    const { originalToolCallId, originalToolName, ...uiArgs } =
      part.input as any;
    return uiArgs;
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
export async function createOpenApiToolset(
  options: OpenAPIToolsClientOptions | OpenAPIToolsClientOptions[],
): Promise<OpenApiToolset> {
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
      const client = new OpenApiToolset(parsedOptions);
      return await client.init();
    } else {
      // For a single schema
      const parsedSchema = await parseSchema(options.schema);
      const client = new OpenApiToolset({
        ...options,
        schema: parsedSchema,
      });
      return await client.init();
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    // console.error(`Failed to create OpenAPI client: ${errorMessage}`);
    throw new Error(`Failed to create OpenAPI client: ${errorMessage}`);
  }
}
