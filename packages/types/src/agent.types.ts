import { AgentCard, AgentSkill } from './a2a.types';

export interface AgentServers {
  url: string;
  description: string;
}

export interface AgentInfo {
  agentName: string;
  agentPath: `@microagent/${string}` | `@microfox/${string}`;
  title: string;
  description: string;
  version: string;
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

type JsonSchema = {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
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

export interface AgentPathAiInstruction {
  systemPrompt?: string;
  preferredModel?: string;
}

export interface AgentPathSecurity {
  requiresAuth?: boolean;
  authSchema?: string[]; // $ref to a schema in the components.schemas (x-auth-packages by default)
  requiresHITL?: boolean;
  hitlPrompt?: string;
  hitlPriority?: number;
  hitlSchema?: JsonSchema;
}

export interface AgentPath {
  [key: string]: {
    operationId: string;
    summary: string;
    description: string;
    tags: string[];
    ai?: AgentPathAiInstruction;
    security?: AgentPathSecurity;
    parameters?: {
      name: string;
      in: 'query' | 'header' | 'path' | 'cookie';
      description: string;
      required: boolean;
      schema: Record<string, any>;
    }[];
    requestBody?: {
      content:
        | {
            'application/json': {
              schema: Record<string, any>;
            };
          }
        | {
            'application/x-www-form-urlencoded': {
              schema: Record<string, any>;
            };
          }
        | {
            'multipart/form-data': {
              schema: Record<string, any>;
            };
          };
    };
    responses?: {
      [key: string]: {
        description: string;
        content: {
          'application/json': {
            schema: Record<string, any>;
          };
        };
      };
    };
  };
}

export interface AgentOpenApi {
  openapi: string; //"3.0.1",
  info: AgentInfo;
  servers: AgentServers;
  ai?: AgentPathAiInstruction;
  security?: AgentPathSecurity;
  paths: Record<string, AgentPath>;
  components: {
    schemas: {
      [key: `x-auth-${string}`]: {
        packageName?: string;
        packageConstructor?: string[];
        customSecrets?: {
          key: string;
          description: string;
          required: boolean;
          type: string;
          format?: string;
          enum?: any[];
          default?: any;
        }[];
      }[];
      [key: `x-hitl-${string}`]: {
        uiType: 'approval' | string;
        uiSchema?: JsonSchema;
      };
      [key: string]: any;
    };
  };
  tags: {
    name: string;
    description: string;
  }[];
}
