import { CoreMessage } from 'ai';
import { z } from 'zod';
import { humanInputSchema } from './human-interaction';

// Available HTTP methods
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

// Type for form values
export type FormValues = Record<string, string>;

// Remove external package imports and define our own types
export type JsonSchema = {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema | JsonSchema[]; // Allow items to be either a single schema or array of schemas
  required?: string[];
  enum?: any[];
  default?: any;
  additionalProperties?: boolean | JsonSchema;
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  $ref?: string;
  $defs?: Record<string, JsonSchema>;
  [key: string]: any;
};

export type OpenAPISchema = {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema; // Allow items to be either a single schema or array of schemas
  required?: string[];
  example?: any;
  enum?: any[];
  default?: any;
  additionalProperties?: boolean | OpenAPISchema;
  oneOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  allOf?: OpenAPISchema[];
  $ref?: string;
};

export type OpenAPIParameter = {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie' | 'body';
  required?: boolean;
  schema: OpenAPISchema;
  description?: string;
  example?: any;
};

export type OpenAPIContent = {
  schema: OpenAPISchema;
};

export type OpenAPIResponse = {
  description: string;
  content?: {
    [key: string]: OpenAPIContent;
  };
};

export type OpenAPIRequestBody = {
  required?: boolean;
  content: {
    [key: string]: OpenAPIContent;
  };
};

export type OpenAPIOperation = {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: {
    [key: string]: OpenAPIResponse;
  };
  instructions?: string;
  method?: string;
  path?: string;
};

export type OpenAPIPath = {
  [method: string]: OpenAPIOperation;
};

export type OpenAPIDoc = {
  openapi: string;
  servers: {
    url: string;
    description: string;
  }[];
  info: {
    title: string;
    version: string;
    mcp_version?: string;
    description?: string;
  };
  paths: {
    [path: string]: OpenAPIPath;
  };
  components?: {
    schemas?: Record<string, OpenAPISchema>;
  };
};

export type ToolMethod = {
  name: string;
  description: string;
  inputSchema: JsonSchema & { type: 'object' };
  returnSchema?: JsonSchema;
};

// Update Tool type to use Zod schema
export type Tool = {
  name: string;
  description: string;
  parameters: z.ZodType;
  execute?: ToolExecuteFn;
};

// AI SDK compatible tools types
export type ToolSchema = {
  description?: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
};

export type ToolSchemas = Record<string, ToolSchema> | 'automatic';

export type ToolExecuteOptions = {
  abortSignal?: AbortSignal;
};

export type ToolExecuteFn = (
  args: Record<string, any>,
  options?: ToolExecuteOptions,
) => Promise<any>;

export type ToolSet = Record<string, Tool>;

export type ToolMetadata = {
  name: string;
  description: string;
  jsonSchema: JsonSchema & {
    type: 'object';
  };
  humanLayer: {
    required: boolean;
  };
};

export type ToolMetadataSet = Record<string, ToolMetadata>;

export type ToolExecuteSet = Record<string, ToolExecuteFn>;

// Schema source configuration
export type SchemaConfig = {
  /**
   * Source of the OpenAPI schema
   * - object: direct OpenAPIDoc object
   * - text: JSON string of the schema
   * - url: URL to fetch the schema from
   */
  type: 'object' | 'text' | 'url';

  /**
   * The OpenAPI schema when type is 'object' or 'text'
   */
  schema?: OpenAPIDoc | string;

  /**
   * URL to fetch the schema from when type is 'url'
   */
  url?: string;
};

export interface OpenAPIToolsClientOptions {
  /**
   * Schema configuration
   */
  schema: SchemaConfig | OpenAPIDoc | string;

  /**
   * Base URL to use for the client
   * If provided, overrides the URL from the schema's servers array
   */
  baseUrl?: string;

  /**
   * Custom headers to include with every request
   */
  headers?: Record<string, string>;

  /**
   * Preset fields to include in request bodies
   * These will be merged with the actual request data, with user-provided fields taking precedence
   */
  presetBodyFields?: Record<string, any>;

  /**
   * Function called on API request errors
   */
  onError?: (error: Error) => void;

  /**
   * Name of the client instance
   */
  name?: string;
}

export interface FetchOptions {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

export interface APIResponse {
  data: any;
  contentType: string;
  status: number;
}

export type ToolOptions = {
  schemas?: ToolSchemas;
  validateParameters?: boolean;
  disabledExecutions?: string[];
  disableAllExecutions?: boolean;
};

export type ToolResult = {
  tools: ToolSet;
  executions: ToolExecuteSet;
  metadata: ToolMetadataSet;
};

/**
 * Defines the standardized contract sent from the server to the client when
 * the AI workflow is paused and requires human feedback.
 */
export interface PendingHumanInputAction {
  /**
   * A clear status flag indicating the workflow is paused.
   */
  status: 'requires_human_input';

  /**
   * Contains the details of the required interaction.
   */
  interaction: {
    /**
     * The unique identifier of the tool call that was intercepted. This is
     * needed to later provide the result back to the AI.
     */
    toolCallId: string;

    /**
     * The structured arguments (`type`, `message`) that the LLM provided
     * when it called the `requestHumanInput` tool.
     */
    args: z.infer<typeof humanInputSchema>;
  };

  /**
   * The complete message history at the point of interception. This is sent
   * to the client so it can be returned later, making the continuation
   * endpoint stateless.
   */
  messages: CoreMessage[];
}

/**
 * Defines the payload that the client must send to the `/continue` endpoint
 * to resume a paused workflow.
 */
export interface ContinuePayload {
  /**
   * The original message history that was provided in the
   * `PendingHumanInputAction`.
   */
  messages: CoreMessage[];

  /**
   * The `toolCallId` from the `PendingHumanInputAction` that is being addressed.
   */
  toolCallId: string;

  /**
   * The input collected from the human user. This can be a confirmation
   * string (e.g., "Yes") or any other text.
   */
  userInput: any;
}
