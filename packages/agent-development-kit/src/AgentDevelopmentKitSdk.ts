import { z } from 'zod';
import {
  Session,
  Event,
  BaseAgent,
  LlmAgent,
  SequentialAgent,
  ParallelAgent,
  LoopAgent,
  Tool,
  ToolContext,
  AuthConfig,
  AuthResponse,
} from './types';

export class AgentDevelopmentKitSDK {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createSession(appName: string, userId?: string): Promise<Session> {
    return this.request<Session>('POST', '/sessions', { appName, userId });
  }

  async getSession(sessionId: string): Promise<Session> {
    return this.request<Session>('GET', `/sessions/${sessionId}`);
  }

  async appendEvent(sessionId: string, event: Event): Promise<void> {
    await this.request<void>('POST', `/sessions/${sessionId}/events`, event);
  }

  async runAgent(agent: BaseAgent, session: Session): Promise<any> {
    return this.request<any>('POST', `/agents/${agent.constructor.name}/run`, {
      sessionId: session.id,
      agentConfig: agent,
    });
  }

  async runTool(toolName: string, sessionId: string, input: any): Promise<any> {
    return this.request<any>('POST', `/tools/${toolName}/run`, {
      sessionId,
      input,
    });
  }

  async requestAuth(authConfig: AuthConfig): Promise<string> {
    return this.request<string>('POST', '/auth/request', authConfig);
  }

  async handleAuthCallback(callbackParams: Record<string, string>): Promise<AuthResponse> {
    return this.request<AuthResponse>('POST', '/auth/callback', callbackParams);
  }

  createLlmAgent(config: Omit<LlmAgent, 'run'>): LlmAgent {
    return {
      ...config,
      run: (session: Session) => this.runAgent(config as LlmAgent, session),
    };
  }

  createSequentialAgent(config: Omit<SequentialAgent, 'run'>): SequentialAgent {
    return {
      ...config,
      run: (session: Session) => this.runAgent(config as SequentialAgent, session),
    };
  }

  createParallelAgent(config: Omit<ParallelAgent, 'run'>): ParallelAgent {
    return {
      ...config,
      run: (session: Session) => this.runAgent(config as ParallelAgent, session),
    };
  }

  createLoopAgent(config: Omit<LoopAgent, 'run'>): LoopAgent {
    return {
      ...config,
      run: (session: Session) => this.runAgent(config as LoopAgent, session),
    };
  }

  createTool(config: Omit<Tool, 'run'>): Tool {
    return {
      ...config,
      run: (input: any, context: ToolContext) =>
        this.runTool(config.name, context.session.id, input),
    };
  }
}

export function createAgentDevelopmentKitSDK(baseUrl: string): AgentDevelopmentKitSDK {
  return new AgentDevelopmentKitSDK(baseUrl);
}
