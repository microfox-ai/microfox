import { AgentCard, AgentSkill } from './a2a.types';

export interface AgentServers {
  url: string;
  description: string;
}

export interface AgentInfo {
  agentName: string;
  agentPath: `@microagent/${string}`;
  title: string;
  description: string;
  version: string;
  iconUrl?: string;
  status?: 'stable' | 'semi-stable' | 'beta' | 'experimental';
  agentCard?: AgentCard;
}

export interface AgentOpenApi {
  info: AgentInfo;
  servers: AgentServers;
  auth: 'x-auth-packages' | string;
  paths: Record<string, any>;
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
