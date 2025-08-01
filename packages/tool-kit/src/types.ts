import { Tool as AiTool, ToolSet as AiToolSet } from 'ai';
import {
  AgentPathAiInstruction,
  AgentOpenApi,
  AgentUi,
  JsonSchema,
  HitlDetails,
  SecurityRequirementObject,
} from '@microfox/types';
import { z } from 'zod';

export type ToolMetaInfo = {
  toolName?: string;
  clientName?: string;
  description?: string;
  summary?: string;
  _id?: string;
};

export type Tool = AiTool &
  ToolMetaInfo & {
    _id?: string;
  };
export type ToolSet = Record<string, Tool>;
// Available HTTP methods
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

// Type for form values
export type FormValues = Record<string, string>;

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
  in: 'query' | 'path' | 'header' | 'cookie' | 'body' | string;
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
  name?: string;
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  ai?: AgentPathAiInstruction;
  security?: SecurityRequirementObject[];
  hitl?: HitlDetails;
  ui?: AgentUi;
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

export type OpenAPIDoc = AgentOpenApi;

export type ToolMethod = {
  name: string;
  description: string;
  inputSchema: JsonSchema & { type: 'object' };
  returnSchema?: JsonSchema;
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

export type ToolExecuteFn = Tool['execute'];

export type ToolMetadata = ToolMetaInfo & {
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

export type AuthOptions = {
  packages?: {
    packageName: string;
    packageConstructor?: string[];
  }[];
  customSecrets?:{
    key: string;
    description: string;
    required: boolean;
    type: string;
    format?: string;
    enum?: any[];
    default?: any;
  }[];
};

export type AuthObject = {
  encryptionKey?: string;
  variables?: {
    key: string;
    value: string;
  }[];
  [key: string]: any;
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

  /**
   * Static authentication object.
   */
  auth?: AuthObject;

  /**
   * Function to dynamically fetch authentication credentials.
   */
  getAuth?: (options: AuthOptions) => Promise<AuthObject>;

  /**
   * Callback to determine if human intervention is required for a tool call.
   */
  getHumanIntervention?: (
    context: HumanInterventionContext,
  ) => Promise<HumanInterventionDecision>;

  /**
   * Function to dynamically fetch additional arguments for a tool call.
   */
  getAdditionalArgs?: (args: {
    toolName: string;
    clientName: string;
    summary?: string;
  }) => Promise<z.ZodObject<any> | undefined>;
}

export interface HumanInterventionContext {
  toolName: string;
  generatedArgs: Record<string, any>;
  mcpConfig: any;
  toolCallId: string;
  auth?: AuthObject;
}

export type HumanDecisionArgs = {
  originalToolCallId?: string;
  originalToolName?: string;
  ui: any;
};

export type HumanInterventionDecision =
  | {
      shouldPause: false;
    }
  | {
      shouldPause: true;
      args: HumanDecisionArgs; // Arguments for the FAKE_HUMAN_INTERACTION tool
    };

export interface PendingToolContext {
  originalToolCallId: string;
  toolName: string;
  originalArgs: object;
  // any other context needed to resume...
}

export interface FetchOptions {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
  auth?: AuthObject;
  getAuth?: () => Promise<AuthObject>;
  getHumanIntervention?: (
    context: HumanInterventionContext,
  ) => Promise<HumanInterventionDecision>;
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
  includeDisabled?: boolean;
  auth?: AuthObject;
  getAuth?: (options: AuthOptions) => Promise<AuthObject>;
  cleanAuth?: (auth: AuthObject) => Promise<AuthObject>;
  getHumanIntervention?: (
    context: HumanInterventionContext,
  ) => Promise<HumanInterventionDecision>;
  getAdditionalArgs?: (args: {
    toolName: string;
    clientName: string;
    summary?: string;
  }) => Promise<z.ZodObject<any> | undefined>;
};

export type ToolResult = {
  tools: ToolSet;
  executions: ToolExecuteSet;
  metadata: ToolMetadataSet;
  uiMaps?: Record<string, any>;
};

export const PAUSED_TOOL_CONTEXT = Symbol('paused_tool_context');

export function isPausedToolContext(
  value: any,
): value is HumanInterventionContext {
  return (
    typeof value === 'object' &&
    value !== null &&
    'context' in value &&
    value.context === PAUSED_TOOL_CONTEXT
  );
}

export type ToolAuth = {
  type: 'oauth2' | 'apiKey';
  // ... existing code ...
};
