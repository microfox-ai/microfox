import { AgentInfo, AgentServers, AgentSkill } from "./agent.types";

export interface AgentOpenApi {
    info: AgentInfo;
    a2a: {
  
      
      skills: AgentSkill[];
    } extends AgentInfo,
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
  