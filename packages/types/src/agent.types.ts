import { AgentCard, TaskState, SecurityScheme } from './a2a.types';
import { AgentUi } from './ui.types';
import { JsonSchema } from './openapi.types';

export interface AgentServers {
  url: string;
  description: string;
}

export interface AgentInfo {
  agentName: string;
  agentPath: `@microagent/${string}` | `@microfox/${string}`;
  version: string;
  mcpVersion?: string; // "1.0.2"
  a2aVersion?: string; // "2.0.5"
  title: string;
  description: string;
  iconUrl?: string;
  status?: 'stable' | 'semi-stable' | 'beta' | 'experimental';
  agentCard?: AgentCard;
  contact?: {
    name: string;
    email: string;
  };
  license?: {
    name: string;
  };
}

export interface AgentPathAiInstruction {
  systemPrompt?: string;
  disableTool?: boolean; // false by default
  preferredModel?: string;
}

export interface ApprovalHitlSchema {
  uiType: 'approval';
  uiSchema?: JsonSchema;
}

export interface HitlDetails {
  requiresHITL?: boolean;
  hitlPrompt?: string;
  hitlPriority?: number;
  hitlSchema?: `x-hitl-${string}` | string | JsonSchema;
}

export type SecurityRequirementObject =
  | {
      [key: string]: string[];
    }
  | { 'x-microfox-packages': `@microfox/${string}` };

export interface ResponseObject {
  description: string;
  content?: {
    [mediaType: string]: {
      schema?: JsonSchema;
    };
  };
}

export interface AgentPath {
  [key: string]: {
    operationId: string;
    summary: string;
    description: string;
    tags: string[];
    ai?: AgentPathAiInstruction;
    hitl?: HitlDetails;
    security?: SecurityRequirementObject[];
    ui?: AgentUi;
    parameters?: {
      name: string;
      in: 'query' | 'header' | 'path' | 'cookie';
      description: string;
      required: boolean;
      schema: JsonSchema;
    }[];
    requestBody?: {
      required?: boolean;
      content: {
        [mediaType: string]: {
          schema: JsonSchema;
        };
      };
    };
    responses?: {
      [key: string]: ResponseObject | { $ref: string };
    };
  };
}

export interface AgentOpenApi {
  openapi: string; //"3.1.0",
  info: AgentInfo;
  servers?: AgentServers[];
  ai?: AgentPathAiInstruction;
  security?: SecurityRequirementObject[];
  ui?: AgentUi;
  paths: Record<string, AgentPath>;
  components: {
    schemas: {
      [key: `x-hitl-${string}`]: ApprovalHitlSchema;
      [key: string]: any;
    };
    securitySchemes?: {
      [key: string]: SecurityScheme | { $ref: string };
    };
  };
  tags: {
    name: string;
    description: string;
  }[];
}

export type AgentTask = {
  taskId: `${string}-${string}-${string}` | `${string}-${string}` | string;
  originUserMessageId?: string;
  originAssistantMessageId?: string;
  state: TaskState;
  createdAt?: string;
  updatedAt?: string;
  data?: {
    metadata?: Record<string, any>;
    response?: Record<string, any>;
    error?: Record<string, any>;
  };
};

export type AgentTaskEvent = {
  taskId: `${string}-${string}-${string}` | `${string}-${string}` | string;
  originUserMessageId: string;
  originAssistantMessageId: string;
  event: 'update' | 'complete' | 'failed';
  state: TaskState;
  metadata?: Record<string, any>;
  response?: Record<string, any>;
  error?: Record<string, any>;
  updatedAt?: string;
};
