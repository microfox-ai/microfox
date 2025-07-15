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

export interface AgentPath {
  [key: string]: {
    operationId: string;
    summary: string;
    description: string;
    tags: string[];
    ai: {
      systemPrompt?: string;
      preferredModel?: string;
    };
    security?: {
      requiresAuth?: boolean;
      authSchemes?: {
        [key: string]: string[];
      };
      requiresHITL?: boolean;
      hitlPrompt?: string;
      hitlPriority?: number;
    };
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
  auth: 'x-auth-packages' | string;
  paths: Record<string, AgentPath>;
  components: {
    schemas: Record<string, any>;
    'x-auth-packages': {
      packageName: string;
      packageConstructor: string[];
      customSecrets: string[];
    }[];
  };
  tags: {
    name: string;
    description: string;
  }[];
}
