import {
  GenerateTextResult,
  LanguageModel,
  UIMessage as Message,
  StepResult,
  StreamTextResult,
  ToolCall,
  ToolCallPart,
  ToolResultPart,
  UIMessageStreamWriter,
  PrepareStepFunction,
  JsonToSseTransformStream,
  StopCondition,
} from 'ai';
import {
  HumanDecisionArgs,
  OpenAPIDoc,
  OpenAPIToolsClientOptions,
  PendingToolContext,
  ToolOptions,
  ToolResult,
} from '../types';
import { parseSchema } from '../utils';
import { OpenApiMCP } from './OpenAPiMcp';
import { ReadableStream } from 'stream/web';

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
          addPendingTool: this.addPendingTool.bind(this),
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
    options?: any,
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
          clientName,
          _id: namespacedKey, // Update name to include namespace
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

  async processToolResult(
    messages: Message[],
    dataStream?: UIMessageStreamWriter,
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

        if (
          (part as any).state === 'output-available' &&
          'approved' in (part as any).output
        ) {
          // Get the tool and check if the tool has an execute function.
          const correspondingCall = thisClientTools.executions[toolName];
          if (!correspondingCall) {
            result = 'Error: No execute function found on tool';
          } else if ((part as any).output.approved) {
            result = await correspondingCall(part.input as any, {
              toolCallId: (part as any).toolCallId,
              messages: messages as any[],
              ...((part as any).output.auth
                ? { auth: (part as any).output.auth }
                : {}),
            });
          } else {
            result = 'Error: User denied access to tool execution';
          }
        }

        // Forward updated tool result to the client.
        if (dataStream && result) {
          dataStream.write({
            type: 'tool-output-available',
            toolCallId: (part as any).toolCallId,
            output: result as any,
            //providerMetadata: {},
          });
        }

        // Return updated toolInvocation with the actual result.
        return {
          ...part,
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

  /**
   * Parses incoming messages for HITL responses, resumes the original tool,
   * and returns a cleaned message history.
   * @param messages The full message history.
   * @returns A promise that resolves to the processed message history.
   */
  async parse(
    messages: Message[],
    dataStream?: UIMessageStreamWriter,
  ): Promise<Message[]> {
    const lastMessage = messages[messages.length - 1];
    if ((lastMessage as any)?.role !== 'tool') {
      return messages;
    }

    const assistantMessageIndex = messages.length - 2;
    const assistantMessage = messages[assistantMessageIndex];

    if (assistantMessage?.role !== 'assistant') {
      return messages; // Should not happen in a valid HITL flow
    }

    const toolResultsFromHuman: ToolResultPart[] = [];
    const fakeToolCallIds = new Set<string>();

    for (const part of lastMessage?.parts ?? []) {
      if ((part as any).type === 'tool-result') {
        const correspondingCall = (assistantMessage?.parts ?? []).find(
          (p: any) =>
            p.type === 'tool-call' && p.toolCallId === (part as any).toolCallId,
        ) as ToolCallPart | undefined;

        if (
          correspondingCall &&
          correspondingCall.toolName === FAKE_HUMAN_INTERACTION_TOOL_NAME
        ) {
          toolResultsFromHuman.push(part as any);
          fakeToolCallIds.add((part as any).toolCallId);
        }
      }
    }

    if (toolResultsFromHuman.length === 0) {
      return messages;
    }

    const realToolResults: ToolResultPart[] = [];
    for (const fakeResult of toolResultsFromHuman) {
      const fakeCall = (assistantMessage.parts ?? []).find(
        (p: any) => p.toolCallId === fakeResult.toolCallId,
      ) as unknown as ToolCallPart;

      const { originalToolCallId } = fakeCall.input as any;
      const humanInput = fakeResult.output;

      /// TODO: remove dependency on this.consumePendingTool
      const pendingContext = this.consumePendingTool(originalToolCallId);
      if (!pendingContext) {
        throw new Error(
          `Could not find pending tool with ID: ${originalToolCallId}`,
        );
      }
      if (!humanInput) {
        throw new Error(
          `No human input found for tool call ID: ${originalToolCallId}`,
        );
      }

      const [clientName, ...operationIdParts] =
        pendingContext.toolName.split(':');
      const operationId = operationIdParts.join(':');

      const client = this.clients.find(c => c.getName() === clientName);
      if (!client) {
        throw new Error(
          `Client "${clientName}" not found for resumed execution.`,
        );
      }

      const finalArgs = { ...pendingContext.originalArgs, ...humanInput };
      const finalResult = await client.callOperation(operationId, finalArgs);

      realToolResults.push({
        type: 'tool-result',
        toolCallId: pendingContext.originalToolCallId,
        toolName: pendingContext.toolName,
        output: finalResult,
      });

      this.consumePendingTool(pendingContext.originalToolCallId);

      if (dataStream) {
        dataStream.write({
          type: 'tool-output-available',
          toolCallId: pendingContext.originalToolCallId,
          output: finalResult,
          providerMetadata: {},
        });
      }
    }

    const newMessages = [...messages];
    const cleanedAssistantParts = (assistantMessage.parts ?? []).filter(
      (p: any) =>
        !(p.type === 'tool-call' && fakeToolCallIds.has(p.toolCallId)),
    );
    newMessages[assistantMessageIndex] = {
      ...assistantMessage,
      parts: cleanedAssistantParts,
    };
    newMessages[messages.length - 1] = {
      ...lastMessage,
      parts: realToolResults as any[],
    };

    return newMessages;
  }

  private createFakeToolCall(
    originalToolCall: ToolCall<any, any>,
    interventionArgs: any,
  ): ToolCallPart {
    return {
      type: 'tool-call',
      toolCallId: `${originalToolCall.toolCallId}-human-intervention`,
      toolName: FAKE_HUMAN_INTERACTION_TOOL_NAME,
      input: {
        originalToolCallId: originalToolCall.toolCallId,
        originalToolName: originalToolCall.toolName,
        ...interventionArgs,
      },
    };
  }

  createHitlStopStep(): StopCondition<any> {
    return async s => {
      const lastStep = s.steps[s.steps.length - 1];
      if (lastStep?.toolResults && lastStep?.toolResults?.length > 0) {
        const allToolResults = lastStep.toolResults;
        if (allToolResults.find(t => t.output._humanIntervention)) {
          return true;
        }
      }
      return false;
    };
  }

  /**
   * Processes the final result from `generateText` to handle HITL markers.
   * It transforms the internal `_humanIntervention` markers into
   * `FAKE_HUMAN_INTERACTION` tool calls for the client-side UI.
   * @param response The raw result from a `generateText` call.
   */
  generate(
    response: GenerateTextResult<any, any>,
  ): GenerateTextResult<any, any> {
    const finalToolCalls: ToolCall<any, any>[] = [];
    const finalToolResults: ToolResultPart[] = [];
    const assistantMessageParts: (ToolCallPart | ToolResultPart)[] = [];

    const originalToolCalls = new Map(
      response.toolCalls.map(tc => [tc.toolCallId, tc]),
    );

    for (const result of response.toolResults) {
      if ((result.output as any)?._humanIntervention === true) {
        // This is a HITL-paused tool. Create a fake tool call for the UI.
        const originalToolCall = originalToolCalls.get(result.toolCallId);
        if (originalToolCall) {
          const fakeToolCall = this.createFakeToolCall(
            originalToolCall,
            (result.output as any).args as HumanDecisionArgs,
          );
          finalToolCalls.push(fakeToolCall);
          assistantMessageParts.push(fakeToolCall);
        }
      } else {
        // This is a normal, executed tool result. Keep it and its original call.
        const originalToolCall = originalToolCalls.get(result.toolCallId);
        if (originalToolCall) {
          finalToolCalls.push(originalToolCall);
        }
        finalToolResults.push(result);
      }
    }

    // Reconstruct the assistant's message, replacing the original tool calls with our new set.
    const originalTextParts =
      (response as any).message?.parts?.filter(
        (p: any) => p.type !== 'tool-call',
      ) ?? [];

    const newResponseMessage = {
      ...(response as any).message,
      parts: [...originalTextParts, ...assistantMessageParts],
    };

    // Return the final, processed result object.
    return {
      ...response,
      message: newResponseMessage,
      toolCalls: finalToolCalls,
      toolResults: finalToolResults,
    } as any;
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
        console.error('Error processing stream for HITL:', error);
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
    console.error(`Failed to create OpenAPI client: ${errorMessage}`);
    throw new Error(`Failed to create OpenAPI client: ${errorMessage}`);
  }
}
