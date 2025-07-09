import {
  UIMessage,
  createUIMessageStream,
  UIMessageStreamWriter,
  createUIMessageStreamResponse,
  UIDataTypes,
  generateId,
  Tool,
  tool,
  JSONValue,
  ToolCallOptions,
  convertToModelMessages,
} from 'ai';
import { StreamWriter } from './helper.js';
import { UITools } from './types.js';
import { z, ZodObject } from 'zod';
import path from 'path';

// --- Custom Errors ---
export class AiKitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiKitError';
  }
}

export class AgentNotFoundError extends AiKitError {
  constructor(path: string) {
    super(`[AiAgentKit] Agent not found for path: ${path}`);
    this.name = 'AgentNotFoundError';
  }
}

export class ToolNotFoundError extends AiKitError {
  constructor(path: string) {
    super(`[AiAgentKit] Tool not found at path: ${path}`);
    this.name = 'ToolNotFoundError';
  }
}

export class ToolValidationError extends AiKitError {
  constructor(path: string, validationError: z.ZodError) {
    const message = `[AiAgentKit] Tool call validation failed for path: ${path}: ${validationError.message}`;
    super(message);
    this.name = 'ToolValidationError';
  }
}

export class MaxCallDepthExceededError extends AiKitError {
  constructor(maxDepth: number) {
    super(`[AiAgentKit] Agent call depth limit (${maxDepth}) exceeded.`);
    this.name = 'MaxCallDepthExceededError';
  }
}

export class AgentDefinitionMissingError extends AiKitError {
  constructor(path: string) {
    super(
      `[AiAgentKit] agentAsTool: No definition found for "${path}". Please define it using '.actAsTool()' or pass a definition as the second argument.`
    );
    this.name = 'AgentDefinitionMissingError';
  }
}

// --- Dynamic Parameter Support ---

/**
 * Converts a path pattern with dynamic parameters (e.g., "/users/:id/posts/:postId")
 * into a RegExp that can match actual paths and extract parameters.
 * @param pattern The path pattern with dynamic parameters
 * @returns A RegExp and parameter names array
 */
function parsePathPattern(pattern: string): {
  regex: RegExp;
  paramNames: string[];
} {
  const paramNames: string[] = [];
  // Split the pattern by dynamic parameter segments, but keep the segments in the result
  const parts = pattern.split(/(\/:[^\/]+)/);

  const regexPattern = parts
    .map((part) => {
      if (part.startsWith('/:')) {
        // This is a dynamic segment like "/:id"
        paramNames.push(part.substring(2)); // Extract "id"
        return '/([^/]+)'; // Replace with a capturing group
      }
      // This is a static segment, escape any special regex characters in it
      return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('');

  const regex = new RegExp(`^${regexPattern}$`);

  return { regex, paramNames };
}

/**
 * Extracts dynamic parameters from a path based on a pattern.
 * @param pattern The path pattern with dynamic parameters
 * @param path The actual path to extract parameters from
 * @returns An object with extracted parameters or null if no match
 */
function extractPathParams(
  pattern: string,
  path: string
): Record<string, string> | null {
  const { regex, paramNames } = parsePathPattern(pattern);
  const match = path.match(regex);

  if (!match) {
    return null;
  }

  const params: Record<string, string> = {};
  paramNames.forEach((paramName, index) => {
    const value = match[index + 1]; // +1 because match[0] is the full match
    if (value !== undefined) {
      params[paramName] = value;
    }
  });

  return params;
}

/**
 * Checks if a path pattern contains dynamic parameters.
 * @param pattern The path pattern to check
 * @returns True if the pattern contains dynamic parameters
 */
function hasDynamicParams(pattern: string): boolean {
  return /\/:[^\/]+/.test(pattern);
}

export type AiStreamWriter<
  METADATA,
  PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
> = UIMessageStreamWriter<UIMessage<METADATA, PARTS, TOOLS>> &
  Omit<StreamWriter<METADATA, TOOLS>, 'writer'> & {
    generateId: typeof generateId;
  };

// --- Core Types ---

/**
 * The context object passed to every agent, tool, and middleware. It contains
 * all the necessary information and utilities for a handler to perform its work.
 * @template METADATA - The type for custom metadata in UI messages.
 * @template PARTS - The type for custom parts in UI messages.
 * @template TOOLS - The type for custom tools in UI messages.
 * @template ContextState - The type for the shared state object.
 */
export type AiContext<
  METADATA,
  PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
  ContextState extends Record<string, any> = Record<string, any>,
> = {
  request: {
    /** The message history for the current request. */
    messages: UIMessage<METADATA, PARTS, TOOLS>[];
    /** Parameters passed from an internal tool or agent call. */
    params?: Record<string, any>;
    [key: string]: any;
  };
  /** A shared, mutable state object that persists for the lifetime of a single request. */
  state: ContextState;
  /**
   * Internal execution context for the router. Should not be modified by user code.
   * @internal
   */
  executionContext: {
    handlerPathStack?: string[];
    currentPath?: string;
    callDepth?: number;
    [key: string]: any;
  };
  /**
   * A unique ID for the top-level request, useful for logging and tracing.
   */
  requestId: string;
  /**
   * A structured logger that automatically includes the `requestId` and current handler path.
   */
  logger: AiLogger;
  /**
   * The stream writer to send data back to the end-user's UI.
   * Includes helpers for writing structured data like tool calls and metadata.
   */
  response: AiStreamWriter<METADATA, PARTS, TOOLS>;
  /**
   * Provides functions for an agent to dispatch calls to other agents or tools.
   * @internal
   */
  next: NextHandler<METADATA, PARTS, TOOLS, ContextState>;

  _onExecutionStart?: () => void;
  _onExecutionEnd?: () => void;
};

/** Represents the `next` function in a middleware chain, used to pass control to the next handler. */
export type NextFunction = () => Promise<void>;
/** A function that handles a request for a specific agent path. */
export type AiHandler<
  METADATA,
  PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
  ContextState extends Record<string, any> = Record<string, any>,
> = (ctx: AiContext<METADATA, PARTS, TOOLS, ContextState>) => Promise<void>;

/** A function that handles a request for a specific tool path, with validated parameters. */
export type AiToolHandler<
  METADATA,
  PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
  ContextState extends Record<string, any> = Record<string, any>,
> =
  | ((
      ctx: AiContext<METADATA, PARTS, TOOLS, ContextState>,
      params: Record<string, any>
    ) => Promise<any>)
  | ((ctx: AiContext<METADATA, PARTS, TOOLS, ContextState>) => Tool<any, any>);

/** A function that creates a Tool on-demand with access to the request context. */
export type AiToolFactory<
  METADATA,
  PARTS extends UIDataTypes,
  TOOLS extends UITools,
  ContextState extends Record<string, any>,
> = (ctx: AiContext<METADATA, PARTS, TOOLS, ContextState>) => Tool<any, any>;

/** A function that acts as middleware, processing a request and optionally passing control to the next handler. */
export type AiMiddleware<
  METADATA,
  PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
  ContextState extends Record<string, any> = Record<string, any>,
> = (
  ctx: AiContext<METADATA, PARTS, TOOLS, ContextState>,
  next: NextFunction
) => Promise<void>;

// --- Router Implementation ---

/** A simple structured logger interface. */
export type AiLogger = {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

/** Internal representation of a registered handler in the router's stack. */
type Layer<
  METADATA,
  PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
  ContextState extends Record<string, any> = Record<string, any>,
> = {
  path: string | RegExp;
  handler: AiMiddleware<METADATA, PARTS, TOOLS, ContextState>;
  isTool: boolean;
  toolOptions?:
    | {
        type: 'static';
        schema: ZodObject<any>;
        description?: string;
        handler: AiToolHandler<METADATA, PARTS, TOOLS, ContextState>;
      }
    | {
        type: 'factory';
        factory: AiToolFactory<METADATA, PARTS, TOOLS, ContextState>;
      };
  isAgent: boolean;
  // Dynamic parameter support
  hasDynamicParams?: boolean;
  paramNames?: string[];
};

/**
 * A composable router for building structured, multi-agent AI applications.
 * It allows you to define agents and tools, compose them together, and handle
 * requests in a predictable, middleware-style pattern.
 *
 * @template KIT_METADATA - The base metadata type for all UI messages in this router.
 * @template PARTS - The base custom parts type for all UI messages.
 * @template TOOLS - The base custom tools type for all UI messages.
 * @template ContextState - The base type for the shared state object.
 */
export class AiRouter<
  KIT_METADATA,
  PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
  ContextState extends Record<string, any> = {},
> {
  private stack: Layer<KIT_METADATA, PARTS, TOOLS, any>[] = [];
  private actAsToolDefinitions: Map<
    string | RegExp,
    { description?: string; inputSchema: ZodObject<any> }
  > = new Map();
  private logger: AiLogger = console;

  /** Configuration options for the router instance. */
  public options: {
    /** The maximum number of agent-to-agent calls allowed in a single request to prevent infinite loops. */
    maxCallDepth: number;
  } = {
    maxCallDepth: 10,
  };

  /**
   * Constructs a new AiAgentKit router.
   * @param stack An optional initial stack of layers, used for composing routers.
   * @param options Optional configuration for the router.
   */
  constructor(
    stack?: Layer<KIT_METADATA, PARTS, TOOLS, any>[],
    options?: { maxCallDepth?: number; logger?: AiLogger }
  ) {
    this.logger = options?.logger ?? console;
    this.logger.log('AiAgentKit v3 initialized.');
    if (stack) {
      this.stack = stack;
    }
    if (options?.maxCallDepth) {
      this.options.maxCallDepth = options.maxCallDepth;
    }
  }

  /**
   * Registers a middleware-style agent that runs for a specific path prefix, regex pattern, or wildcard.
   * Agents can modify the context and must call `next()` to pass control to the next handler in the chain.
   * This method is primarily for middleware. For terminal agents, see `.agent()` on an instance.
   *
   * @param path The path prefix, regex pattern, or "*" for wildcard matching.
   * @param agents The agent middleware function(s).
   */
  agent<
    MW_METADATA,
    MW_TOOLS extends UITools,
    MW_STATE extends Record<string, any>,
  >(
    agentPath:
      | string
      | RegExp
      | AiMiddleware<MW_METADATA, PARTS, MW_TOOLS, ContextState & MW_STATE>,
    ...agents: (
      | AiMiddleware<MW_METADATA, PARTS, MW_TOOLS, ContextState & MW_STATE>
      | AiRouter<MW_METADATA, PARTS, MW_TOOLS, ContextState & MW_STATE>
    )[]
  ): AiRouter<
    KIT_METADATA | MW_METADATA,
    PARTS,
    TOOLS & MW_TOOLS,
    ContextState & MW_STATE
  > {
    let prefix: string | RegExp = '/';
    if (typeof agentPath === 'string' || agentPath instanceof RegExp) {
      prefix = agentPath;
    } else {
      agents.unshift(agentPath);
    }

    for (const handler of agents) {
      if (typeof handler !== 'function') {
        // Check if it's an AiAgentKit instance for mounting
        if (handler instanceof AiRouter && typeof prefix === 'string') {
          const stackToMount = handler.getStackWithPrefix(prefix);
          this.stack.push(...(stackToMount as any));
          this.logger.log(
            `Router mounted: path=${prefix}, layers=${stackToMount.length}`
          );
          // Also mount actAsTool definitions from the sub-router
          const mountPath = prefix.toString();
          handler.actAsToolDefinitions.forEach((value, key) => {
            const keyPath = key.toString();
            const relativeKeyPath = keyPath.startsWith('/')
              ? keyPath.substring(1)
              : keyPath;
            const newKey = path.posix.join(mountPath, relativeKeyPath);
            this.actAsToolDefinitions.set(newKey, value);
          });
        }
        continue;
      }
      this.stack.push({
        path: prefix,
        handler: handler as any,
        isTool: false,
        isAgent: true, // Mark as an agent
      });
      this.logger.log(`Agent registered: path=${prefix}`);
    }

    return this as any;
  }

  /**
   * Mounts a middleware function or another AiAgentKit router at a specific path.
   * This is the primary method for composing routers and applying cross-cutting middleware.
   *
   * @param path The path prefix to mount the handler on.
   * @param handler The middleware function or AiAgentKit router instance to mount.
   */
  use(
    mountPathArg: string | RegExp,
    handler:
      | AiMiddleware<KIT_METADATA, PARTS, TOOLS, ContextState>
      | AiRouter<any, any, any, any>
  ): this {
    if (mountPathArg instanceof RegExp && handler instanceof AiRouter) {
      throw new AiKitError(
        '[AiAgentKit] Mounting a router on a RegExp path is not supported.'
      );
    }

    if (handler instanceof AiRouter) {
      const router = handler;
      const mountPath = mountPathArg.toString().replace(/\/$/, ''); // remove trailing slash
      // Mount routes from the sub-router
      router.stack.forEach((layer) => {
        const layerPath = layer.path.toString();
        // Prevent layer paths starting with '/' from being treated as absolute by join
        const relativeLayerPath = layerPath.startsWith('/')
          ? layerPath.substring(1)
          : layerPath;
        const newPath = path.posix.join(mountPath, relativeLayerPath);
        this.stack.push({ ...layer, path: newPath });
      });
      // Mount tool definitions from the sub-router
      router.actAsToolDefinitions.forEach((value, key) => {
        const keyPath = key.toString();
        const relativeKeyPath = keyPath.startsWith('/')
          ? keyPath.substring(1)
          : keyPath;
        const newKey = path.posix.join(mountPath, relativeKeyPath);
        this.actAsToolDefinitions.set(newKey, value);
      });
    } else {
      // It's a middleware
      this.stack.push({
        path: mountPathArg,
        handler: handler,
        isTool: false,
        isAgent: false, // Middleware is not a terminal agent
      });
    }
    return this as any;
  }

  /**
   * Pre-defines the schema and description for an agent when it is used as a tool by an LLM.
   * This allows `next.agentAsTool()` to create a valid `Tool` object without needing the definition at call time.
   * @param path The path of the agent being defined.
   * @param options The tool definition, including a Zod schema and description.
   */
  actAsTool(
    path: string | RegExp,
    options: {
      description?: string;
      inputSchema: ZodObject<any>;
    }
  ) {
    this.actAsToolDefinitions.set(path, options);
    this.logger.log(
      `[actAsTool] Added definition: ${path} -> ${JSON.stringify(options)}`
    );
    this.logger.log(
      `[actAsTool] Router now has ${this.actAsToolDefinitions.size} definitions`
    );
    return this;
  }

  // Overload for factory-based tools
  tool<
    TOOL_METADATA,
    TOOL_TOOLS extends UITools,
    TOOL_STATE extends Record<string, any>,
  >(
    path: string | RegExp,
    factory: AiToolFactory<
      TOOL_METADATA,
      PARTS,
      TOOL_TOOLS,
      ContextState & TOOL_STATE
    >
  ): AiRouter<
    KIT_METADATA | TOOL_METADATA,
    PARTS,
    TOOLS & TOOL_TOOLS,
    ContextState & TOOL_STATE
  >;
  // Overload for static tools
  tool<
    TOOL_METADATA,
    TOOL_TOOLS extends UITools,
    TOOL_STATE extends Record<string, any>,
    TOOL_PARAMS extends ZodObject<any>,
  >(
    path: string | RegExp,
    options: {
      schema: TOOL_PARAMS;
      description?: string;
    },
    handler: (
      ctx: AiContext<
        TOOL_METADATA,
        PARTS,
        TOOL_TOOLS,
        ContextState & TOOL_STATE
      >,
      params: z.infer<TOOL_PARAMS>
    ) => Promise<any>
  ): AiRouter<
    KIT_METADATA | TOOL_METADATA,
    PARTS,
    TOOLS & TOOL_TOOLS,
    ContextState & TOOL_STATE
  >;
  // Implementation
  tool<
    TOOL_METADATA,
    TOOL_TOOLS extends UITools,
    TOOL_STATE extends Record<string, any>,
    TOOL_PARAMS extends ZodObject<any>,
  >(
    path: string | RegExp,
    optionsOrFactory:
      | {
          schema: TOOL_PARAMS;
          description?: string;
        }
      | AiToolFactory<
          TOOL_METADATA,
          PARTS,
          TOOL_TOOLS,
          ContextState & TOOL_STATE
        >,
    handler?: AiToolHandler<
      TOOL_METADATA,
      PARTS,
      TOOL_TOOLS,
      ContextState & TOOL_STATE
    >
  ): AiRouter<
    KIT_METADATA | TOOL_METADATA,
    PARTS,
    TOOLS & TOOL_TOOLS,
    ContextState & TOOL_STATE
  > {
    this.logger.log(`[AiAgentKit][tool] Registering tool at path:`, path);
    if (this.stack.some((l) => l.isTool && l.path === path)) {
      this.logger.error(
        `[AiAgentKit][tool] Tool already registered for path: ${path}`
      );
      throw new AiKitError(`A tool is already registered for path: ${path}`);
    }
    if (typeof optionsOrFactory === 'function' && !handler) {
      const factory = optionsOrFactory as AiToolFactory<any, any, any, any>;
      const isDynamicPath = typeof path === 'string' && hasDynamicParams(path);

      const toolMiddleware: AiMiddleware<any, any, any, any> = async (
        ctx,
        _next
      ) => {
        this.logger.log(
          `[Tool Middleware] Executing factory for path "${path}". Messages in context: ${
            ctx.request.messages?.length ?? 'undefined'
          }`
        );
        // Factory-based tool called directly.
        const toolObject = factory(ctx);

        if (!toolObject.execute) {
          throw new AiKitError(
            `[AiAgentKit] Tool from factory at path ${path} does not have an execute method.`
          );
        }

        // Validate parameters using the tool's schema
        const schema = toolObject.inputSchema as ZodObject<any> | undefined;
        if (!schema) {
          this.logger.warn(
            `[AiAgentKit][tool] Factory-based tool at path ${path} has no inputSchema. Executing without params.`
          );
          return toolObject.execute({} as any, {} as ToolCallOptions);
        }

        const parsedParams = schema.safeParse(ctx.request.params);

        if (!parsedParams.success) {
          this.logger.error(
            `[AiAgentKit][tool] Tool call validation failed for path: ${path}:`,
            parsedParams.error.message
          );
          throw new ToolValidationError(path.toString(), parsedParams.error);
        }

        // Execute the tool with validated parameters.
        // We pass empty options as this is a direct internal call.
        return toolObject.execute(parsedParams.data, {
          messages: convertToModelMessages(ctx.request.messages ?? []),
          toolCallId:
            'tool-' +
            (path.toString()?.split('/').pop() ?? 'direct-call') +
            '-' +
            generateId(),
        });
      };
      this.stack.push({
        path,
        handler: toolMiddleware,
        isTool: true,
        toolOptions: {
          type: 'factory',
          factory,
        },
        isAgent: false,
        hasDynamicParams: isDynamicPath,
      });
      this.logger.log(
        `Tool registered: path=${path}, type=factory${
          isDynamicPath ? ' (dynamic)' : ''
        }`
      );
      return this as any;
    }
    if (typeof optionsOrFactory === 'object' && handler) {
      const options = optionsOrFactory as {
        schema: ZodObject<any>;
        description?: string;
      };
      const isDynamicPath = typeof path === 'string' && hasDynamicParams(path);
      const dynamicParamInfo = isDynamicPath
        ? parsePathPattern(path as string)
        : null;
      const toolMiddleware: AiMiddleware<
        TOOL_METADATA,
        PARTS,
        TOOL_TOOLS,
        ContextState & TOOL_STATE
      > = async (ctx, _next) => {
        if (isDynamicPath && typeof path === 'string') {
          const pathParams = extractPathParams(path, ctx.request.path || '');
          this.logger.log(
            `[AiAgentKit][tool] Extracted dynamic path params:`,
            pathParams
          );
          if (pathParams) {
            ctx.request.params = {
              ...ctx.request.params,
              ...pathParams,
            };
          }
        }
        const parsedParams = options.schema.safeParse(ctx.request.params);
        if (!parsedParams.success) {
          this.logger.error(
            `[AiAgentKit][tool] Tool call validation failed for path: ${path}:`,
            parsedParams.error.message
          );
          throw new ToolValidationError(path.toString(), parsedParams.error);
        }
        const staticHandler = handler as (
          ctx: AiContext<any, any, any, any>,
          params: Record<string, any>
        ) => Promise<any>;
        return staticHandler(ctx, parsedParams.data);
      };
      this.stack.push({
        path,
        handler: toolMiddleware as any,
        isTool: true,
        toolOptions: {
          type: 'static',
          schema: options.schema,
          description: options.description,
          handler: handler as any,
        },
        isAgent: false,
        hasDynamicParams: isDynamicPath,
        paramNames: dynamicParamInfo?.paramNames,
      });
      this.logger.log(
        `Tool registered: path=${path}, type=static${
          isDynamicPath ? ' (dynamic)' : ''
        }`
      );
      return this as any;
    }
    this.logger.error(
      `[AiAgentKit][tool] Invalid arguments for tool registration at path: ${path}`
    );
    throw new AiKitError(
      `Invalid arguments for tool registration at path: ${path}`
    );
  }

  /**
   * Returns the internal stack of layers. Primarily used for manual router composition.
   * @deprecated Prefer using `.use()` for router composition.
   */
  getStack() {
    return this.stack;
  }

  /**
   * Returns the internal stack with a path prefix applied to each layer.
   * @param prefix The prefix to add to each path.
   * @deprecated Prefer using `.use()` for router composition.
   */
  getStackWithPrefix(prefix: string) {
    return this.stack.map((layer) => {
      let newPath: string | RegExp;
      if (layer.path instanceof RegExp) {
        // This is a simplistic way to combine regex and might need refinement
        newPath = new RegExp(prefix.replace(/\\/g, '\\\\') + layer.path.source);
      } else {
        const layerPathStr = layer.path.toString();
        // Prevent layer paths starting with '/' from being treated as absolute by join
        const relativeLayerPath = layerPathStr.startsWith('/')
          ? layerPathStr.substring(1)
          : layerPathStr;
        newPath = path.posix.join(prefix, relativeLayerPath);
      }

      return {
        ...layer,
        path: newPath,
      };
    });
  }

  /**
   * Resolves a path based on the parent path and the requested path.
   * - If path starts with `@/`, it's an absolute path from the root.
   * - Otherwise, it's a relative path.
   * @internal
   */
  private _resolvePath(parentPath: string, newPath: string): string {
    if (newPath.startsWith('@/')) {
      // Absolute path from root, use POSIX normalize for consistency
      return path.posix.normalize(newPath.substring(1));
    }
    // Relative path, use POSIX join to ensure consistent behavior
    const joinedPath = path.posix.join(parentPath, newPath);
    return joinedPath;
  }

  /**
   * Creates a new context for an internal agent or tool call.
   * It inherits from the parent context but gets a new logger and call depth.
   * @internal
   */
  private _createSubContext(
    parentCtx: AiContext<KIT_METADATA, PARTS, TOOLS, ContextState>,
    options: {
      type: 'agent' | 'tool';
      path: string;
      messages?: UIMessage<KIT_METADATA, PARTS, TOOLS>[];
      params?: Record<string, any>;
    }
  ) {
    const parentDepth = parentCtx.executionContext.callDepth ?? 0;
    const newCallDepth = parentDepth + (options.type === 'agent' ? 1 : 0);

    const subContext: AiContext<KIT_METADATA, PARTS, TOOLS, ContextState> = {
      ...parentCtx,
      // Deep clone state and execution context to prevent race conditions.
      state: JSON.parse(JSON.stringify(parentCtx.state)),
      executionContext: {
        ...parentCtx.executionContext,
        currentPath: options.path,
        callDepth: newCallDepth,
      },
      request: {
        ...parentCtx.request,
        messages:
          options.messages ||
          parentCtx.request.messages ||
          ([] as UIMessage<KIT_METADATA, PARTS, TOOLS>[]),
        params: options.params,
        path: options.path, // The path to execute
      },
      logger: this._createLogger(
        parentCtx.requestId,
        options.path,
        newCallDepth
      ),
      next: undefined as any, // Will be replaced right after
    };

    // The current path for the new context is the path we are about to execute.
    subContext.executionContext.currentPath = options.path;

    subContext.next = new NextHandler(
      subContext,
      this,
      (parentCtx as any)._onExecutionStart,
      (parentCtx as any)._onExecutionEnd,
      parentCtx.next
    ) as any;

    return subContext;
  }

  /**
   * Creates a new logger instance with a structured prefix.
   * @internal
   */
  private _createLogger(
    requestId: string,
    path: string | RegExp,
    callDepth: number = 0
  ): AiLogger {
    const indent = '  '.repeat(callDepth);
    const prefix = `${indent}[${path.toString()}]`;
    // Add requestId to every log message for better tracking.
    const fullPrefix = `[${requestId}]${prefix}`;
    return {
      log: (...args: any[]) => this.logger.log(fullPrefix, ...args),
      warn: (...args: any[]) => this.logger.warn(fullPrefix, ...args),
      error: (...args: any[]) => this.logger.error(fullPrefix, ...args),
    };
  }

  /**
   * Calculates a specificity score for a layer to enable Express-style routing.
   * Higher score means more specific.
   * - Middleware is less specific than an agent/tool.
   * - Deeper paths are more specific.
   * - Static segments are more specific than dynamic segments.
   * @internal
   */
  private _getSpecificityScore(layer: Layer<any, any, any, any>): number {
    const path = layer.path.toString();
    let score = 0;

    // Base score on depth. Deeper is more specific.
    score += path.split('/').length * 100;

    // More dynamic segments mean less specific.
    score -= (path.match(/:/g) || []).length * 10;

    // Regex is less specific than a string path.
    if (layer.path instanceof RegExp) {
      score -= 50;
    }

    // Agents/tools are more specific than middleware.
    if (layer.isAgent || layer.isTool) {
      score += 1;
    }

    return score;
  }

  /**
   * The core execution engine. It finds all matching layers for a given path
   * and runs them in a middleware-style chain.
   * @internal
   */
  private async _execute(
    path: string,
    ctx: AiContext<KIT_METADATA, PARTS, TOOLS, ContextState>,
    isInternalCall = false
  ) {
    // The context's `currentPath` is now the single source of truth.
    // No more stack manipulation is needed here.
    try {
      const normalizedPath =
        path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

      ctx.logger.log(`Executing path. isInternalCall=${isInternalCall}`);
      const layersToRun = this.stack.filter((layer) => {
        let shouldRun = false;

        // Handle RegExp paths. For internal calls, we demand an exact match.
        if (layer.path instanceof RegExp) {
          if (isInternalCall) {
            const exactRegex = new RegExp(`^${layer.path.source}$`);
            shouldRun = exactRegex.test(normalizedPath);
          } else {
            shouldRun = layer.path.test(normalizedPath);
          }
        } else if (typeof layer.path === 'string') {
          const layerPath = layer.path;

          // Wildcard middleware only runs for external calls.
          if (layerPath === '*') {
            return !isInternalCall;
          }

          const normalizedLayerPath =
            layerPath.length > 1 && layerPath.endsWith('/')
              ? layerPath.slice(0, -1)
              : layerPath;

          const isExactMatch = normalizedPath === normalizedLayerPath;

          if (isInternalCall) {
            // --- Internal Call Logic ---
            // For internal calls, we only consider exact matches for all layer types.
            if (layer.isTool && layer.hasDynamicParams) {
              shouldRun = extractPathParams(layerPath, normalizedPath) !== null;
            } else {
              shouldRun = isExactMatch;
            }
          } else {
            // --- External Call Logic ---
            if (layer.isTool) {
              // Tools are matched exactly or via dynamic path parameters.
              if (layer.hasDynamicParams) {
                shouldRun =
                  extractPathParams(layerPath, normalizedPath) !== null;
              } else {
                shouldRun = isExactMatch;
              }
            } else if (layer.isAgent) {
              // Agents are only matched exactly.
              shouldRun = isExactMatch;
            } else {
              // Middlewares are matched by prefix.
              shouldRun = normalizedPath.startsWith(normalizedLayerPath);
            }
          }
        }

        if (shouldRun) {
          ctx.logger.log(
            `[AiAgentKit][_execute] Layer MATCH: path=${normalizedPath}, layer.path=${layer.path}, isTool=${layer.isTool}, isAgent=${layer.isAgent}, isInternal=${isInternalCall}`
          );
        }
        return shouldRun;
      });

      // Sort layers by specificity (most general first) to ensure correct execution order.
      layersToRun.sort(
        (a, b) => this._getSpecificityScore(a) - this._getSpecificityScore(b)
      );

      const layerDescriptions = layersToRun.map(
        (l) =>
          `${l.path.toString()} (${
            l.isTool ? 'tool' : l.isAgent ? 'agent' : 'middleware'
          })`
      );
      ctx.logger.log(
        `Found ${layersToRun.length} layers to run: [${layerDescriptions.join(
          ', '
        )}]`
      );
      const hasTool = layersToRun.some((l) => l.isTool);
      const hasAgent = layersToRun.some((l) => l.isAgent);

      if (!layersToRun.length) {
        const errorMsg = `No agent or tool found for path: ${normalizedPath}`;
        ctx.logger.error(errorMsg);
        throw new AgentNotFoundError(normalizedPath);
      }

      // A more robust, explicit dispatcher to avoid promise chain issues.
      const dispatch = async (index: number): Promise<void> => {
        const layer = layersToRun[index];
        if (!layer) {
          // End of the chain
          return;
        }

        const next = () => dispatch(index + 1);

        const layerPath =
          typeof layer.path === 'string' ? layer.path : layer.path.toString();

        const layerType = layer.isTool
          ? 'tool'
          : layer.isAgent
            ? 'agent'
            : 'middleware';
        ctx.logger.log(`-> Running ${layerType}: ${layerPath}`);

        try {
          if (ctx._onExecutionStart) {
            ctx._onExecutionStart();
          }
          // The handler is an async function, so we can await it directly.
          // The original Promise wrapper was redundant and could hide issues.
          await layer.handler(ctx, next);

          ctx.logger.log(`<- Finished ${layerType}: ${layerPath}`);
        } catch (err) {
          ctx.logger.error(
            `Error in ${layerType} layer for path: ${layerPath}`,
            err
          );
          throw err;
        } finally {
          if (ctx._onExecutionEnd) {
            ctx._onExecutionEnd();
          }
        }
      };

      await dispatch(0);
      return;
    } finally {
      // No-op. Stack is managed by context creation/destruction.
    }
  }

  private pendingExecutions = 0;

  /**
   * The main public entry point for the router. It handles an incoming request,
   * sets up the response stream, creates the root context, and starts the execution chain.
   *
   * @param path The path of the agent or tool to execute.
   * @param initialContext The initial context for the request, typically containing messages.
   * @returns A standard `Response` object containing the rich UI stream.
   */
  handle(
    path: string,
    initialContext: Omit<
      AiContext<KIT_METADATA, PARTS, TOOLS, ContextState>,
      | 'state'
      | 'response'
      | 'next'
      | 'requestId'
      | 'logger'
      | 'executionContext'
    >
  ): Response {
    this.logger.log(`Handling request for path: ${path}`);
    const self = this; // Reference to the router instance

    // --- Execution Lifecycle Management ---
    let executionCompletionResolver: (() => void) | null = null;
    const executionCompletionPromise = new Promise<void>((resolve) => {
      executionCompletionResolver = resolve;
    });

    // --- End Execution Lifecycle Management ---

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        originalMessages: initialContext.request.messages,
        execute: async ({ writer }) => {
          const streamWriter = new StreamWriter<KIT_METADATA, TOOLS>(writer);
          const requestId = generateId();

          const ctx: AiContext<KIT_METADATA, PARTS, TOOLS, ContextState> & {
            _onExecutionStart: () => void;
            _onExecutionEnd: () => void;
          } = {
            ...initialContext,
            request: {
              ...initialContext.request,
              path: path, // Set the initial path for the root context
            },
            state: {} as any,
            executionContext: { currentPath: path, callDepth: 0 },
            requestId: requestId,
            logger: self._createLogger(requestId, path, 0),
            response: {
              ...writer,
              writeMessageMetadata: streamWriter.writeMessageMetadata,
              writeCustomTool: streamWriter.writeCustomTool,
              writeObjectAsTool: streamWriter.writeObjectAsTool,
              generateId: generateId,
            },
            next: undefined as any, // Will be replaced right after
            _onExecutionStart: () => {
              self.pendingExecutions++;
              self.logger.log(
                `[AiAgentKit][lifecycle] Execution started. Pending: ${self.pendingExecutions}`
              );
            },
            _onExecutionEnd: () => {
              self.pendingExecutions--;
              self.logger.log(
                `[AiAgentKit][lifecycle] Execution ended. Pending: ${self.pendingExecutions}`
              );
              if (self.pendingExecutions === 0 && executionCompletionResolver) {
                self.logger.log(
                  `[AiAgentKit][lifecycle] All executions finished. Resolving promise.`
                );
                executionCompletionResolver();
              }
            },
          };
          ctx.next = new NextHandler(
            ctx,
            self,
            ctx._onExecutionStart,
            ctx._onExecutionEnd
          ) as any;

          ctx._onExecutionStart();
          self.logger.log(
            `[AiAgentKit][lifecycle] Main execution chain started.`
          );

          // Fire off the main execution chain. We don't await it here because, in a streaming
          // context, the await might resolve prematurely when the agent yields control.
          // Instead, we catch errors and use .finally() to reliably mark the end of this
          // specific execution, while the main function body waits on the lifecycle promise.
          // self
          //   ._execute(path, ctx)
          //   .catch((err) => {
          //     ctx.logger.error("Unhandled error in main execution chain", err);
          //     // Optionally, you could write an error message to the stream here.
          //   })
          //   .finally(() => {
          //     ctx._onExecutionEnd();
          //   });

          try {
            await self._execute(path, ctx);
          } catch (err) {
            ctx.logger.error('Unhandled error in main execution chain', err);
          } finally {
            ctx._onExecutionEnd();
            self.logger.log(
              `[AiAgentKit][lifecycle] Main execution chain finished.`
            );
          }

          // ctx.next
          //   .callAgent(path, initialContext.request.params)
          //   .catch((err) => {
          //     ctx.logger.error("Unhandled error in main execution chain", err);
          //   });

          // Wait for the promise that resolves only when all executions (the main one
          // and all sub-calls) have completed.
          await executionCompletionPromise;
          self.logger.log(
            `[AiAgentKit][lifecycle] All executions truly finished. Stream can be safely closed.`
          );
        },
      }),
    });
  }
}

class NextHandler<
  METADATA,
  PARTS extends UIDataTypes,
  TOOLS extends UITools,
  ContextState extends Record<string, any>,
> {
  public maxCallDepth: number;

  constructor(
    private ctx: AiContext<METADATA, PARTS, TOOLS, ContextState>,
    private router: AiRouter<METADATA, PARTS, TOOLS, ContextState>,
    private onExecutionStart: () => void,
    private onExecutionEnd: () => void,
    parentNext?: NextHandler<METADATA, PARTS, TOOLS, ContextState>
  ) {
    this.maxCallDepth = this.router.options.maxCallDepth;
  }

  async callAgent(
    agentPath: string,
    params?: Record<string, any>,
    options?: ToolCallOptions
  ): Promise<{ ok: true; data: any } | { ok: false; error: Error }> {
    this.onExecutionStart();
    try {
      const currentDepth = this.ctx.executionContext.callDepth ?? 0;
      if (currentDepth >= this.maxCallDepth) {
        const err = new MaxCallDepthExceededError(this.maxCallDepth);
        this.ctx.logger.error(`[callAgent] Aborting. ${err.message}`);
        throw err;
      }
      const parentPath = this.ctx.executionContext.currentPath || '/';
      const resolvedPath = (this.router as any)._resolvePath(
        parentPath,
        agentPath
      );

      this.ctx.logger.log(`Calling agent: resolvedPath='${resolvedPath}'`);

      const subContext = (this.router as any)._createSubContext(this.ctx, {
        type: 'agent',
        path: resolvedPath,
        params: params,
        messages: this.ctx.request.messages,
      });
      const data = await (this.router as any)._execute(
        resolvedPath,
        subContext,
        true
      );
      return { ok: true, data };
    } catch (error: any) {
      this.ctx.logger.error(`[callAgent] Error:`, error);
      return { ok: false, error };
    } finally {
      this.onExecutionEnd();
    }
  }

  async callTool<T extends z.ZodObject<any>>(
    toolPath: string,
    params: z.infer<T>,
    options?: ToolCallOptions
  ): Promise<{ ok: true; data: any } | { ok: false; error: Error }> {
    this.onExecutionStart();
    try {
      const parentPath = this.ctx.executionContext.currentPath || '/';
      const resolvedPath = (this.router as any)._resolvePath(
        parentPath,
        toolPath
      );

      this.ctx.logger.log(`Calling tool: resolvedPath='${resolvedPath}'`);

      const subContext = (this.router as any)._createSubContext(this.ctx, {
        type: 'tool',
        path: resolvedPath,
        params: params,
        messages: this.ctx.request.messages,
      });
      const data = await (this.router as any)._execute(
        resolvedPath,
        subContext,
        true
      );
      return { ok: true, data };
    } catch (error: any) {
      this.ctx.logger.error(`[callTool] Error:`, error);
      return { ok: false, error };
    } finally {
      this.onExecutionEnd();
    }
  }

  attachTool<SCHEMA extends z.ZodObject<any>>(
    toolPath: string,
    _tool?: Omit<Tool<z.infer<SCHEMA>, any>, 'description'>
  ): Tool<z.infer<SCHEMA>, any> {
    const parentPath = this.ctx.executionContext.currentPath || '/';
    const resolvedPath = (this.router as any)._resolvePath(
      parentPath,
      toolPath
    );
    this.ctx.logger.log(`Attaching tool: resolvedPath='${resolvedPath}'`);

    const layer = (this.router as any).stack.find((l: any) => {
      if (!l.isTool) return false;
      if (l.path === resolvedPath) return true;
      if (l.hasDynamicParams && typeof l.path === 'string') {
        return extractPathParams(l.path, resolvedPath) !== null;
      }
      return false;
    });
    if (!layer || !layer.toolOptions) {
      this.ctx.logger.error(
        `[attachTool] Tool not found at resolved path: ${resolvedPath}`
      );
      throw new ToolNotFoundError(resolvedPath);
    }
    if (layer.toolOptions.type === 'factory') {
      return layer.toolOptions.factory(this.ctx);
    }
    const { description, schema } = layer.toolOptions;
    return {
      description,
      inputSchema: schema,
      ...(_tool ?? {}),
      execute: async (params: z.infer<SCHEMA>, options: ToolCallOptions) => {
        if (_tool?.execute) {
          return await _tool.execute?.(params as any, options);
        }
        const result = await this.callTool(toolPath, params, options);
        if (!result.ok) {
          throw result.error;
        }
        return result.data;
      },
    } as unknown as Tool<z.infer<SCHEMA>, any>;
  }

  agentAsTool<INPUT extends JSONValue | unknown | never = any, OUTPUT = any>(
    agentPath: string,
    toolDefinition?: Tool<INPUT, OUTPUT>
  ) {
    const parentPath = this.ctx.executionContext.currentPath || '/';
    const resolvedPath = (this.router as any)._resolvePath(
      parentPath,
      agentPath
    );
    let preDefined;
    const pathsToTry = [resolvedPath];
    // If the agentPath starts with '/', it's an absolute path from root, so also try it directly
    if (agentPath.startsWith('/')) {
      pathsToTry.unshift(agentPath);
    }
    for (const pathToTry of pathsToTry) {
      for (const [key, value] of (this.router as any).actAsToolDefinitions) {
        if (typeof key === 'string') {
          // Check for exact match first
          if (key === pathToTry) {
            preDefined = value;
            break;
          }
          // Then check for dynamic path parameters
          if (extractPathParams(key, pathToTry) !== null) {
            preDefined = value;
            break;
          }
        }
        // Basic RegExp match
        if (key instanceof RegExp && key.test(pathToTry)) {
          preDefined = value;
          break;
        }
      }
      if (preDefined) break;
    }

    const definition = toolDefinition || preDefined;
    if (!definition) {
      this.ctx.logger.error(
        `[agentAsTool] No definition found for agent at resolved path: ${resolvedPath}`
      );
      throw new AgentDefinitionMissingError(resolvedPath);
    }
    return {
      ...definition,
      execute: async (params: any, options: any) => {
        const result = await this.callAgent(agentPath, params, options);
        if (!result.ok) {
          throw result.error;
        }
        return result.data;
      },
    } as Tool<INPUT, OUTPUT>;
  }
}
