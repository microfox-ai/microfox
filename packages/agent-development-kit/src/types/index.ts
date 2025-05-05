import { z } from 'zod';

export const SessionSchema = z.object({
  id: z.string().describe('Unique identifier for the session'),
  state: z.record(z.unknown()).describe('Current state of the session'),
  events: z.array(z.lazy(() => EventSchema)).describe('List of events in the session'),
});

export type Session = z.infer<typeof SessionSchema>;

export const EventSchema = z.object({
  id: z.string().describe('Unique identifier for the event'),
  timestamp: z.date().describe('Timestamp of when the event occurred'),
  author: z.string().describe('Author of the event'),
  actions: z.array(z.unknown()).describe('Actions associated with the event'),
});

export type Event = z.infer<typeof EventSchema>;

export const BaseAgentSchema = z.object({
  name: z.string().describe('Name of the agent'),
  description: z.string().optional().describe('Description of the agent'),
  sub_agents: z.array(z.lazy(() => BaseAgentSchema)).optional().describe('Sub-agents of this agent'),
});

export type BaseAgent = z.infer<typeof BaseAgentSchema> & {
  run: (session: Session) => Promise<any>;
};

export const LlmAgentSchema = BaseAgentSchema.extend({
  model: z.string().describe('LLM model to use'),
  tools: z.array(z.lazy(() => ToolSchema)).describe('Tools available to the agent'),
  instructions: z.string().describe('Instructions for the agent'),
  examples: z.array(z.string()).optional().describe('Example interactions'),
});

export type LlmAgent = z.infer<typeof LlmAgentSchema> & {
  run: (session: Session) => Promise<any>;
};

export const SequentialAgentSchema = BaseAgentSchema.extend({
  agents: z.array(z.lazy(() => BaseAgentSchema)).describe('Ordered list of agents to run sequentially'),
});

export type SequentialAgent = z.infer<typeof SequentialAgentSchema> & {
  run: (session: Session) => Promise<any>;
};

export const ParallelAgentSchema = BaseAgentSchema.extend({
  agents: z.array(z.lazy(() => BaseAgentSchema)).describe('List of agents to run in parallel'),
});

export type ParallelAgent = z.infer<typeof ParallelAgentSchema> & {
  run: (session: Session) => Promise<any>;
};

export const LoopAgentSchema = BaseAgentSchema.extend({
  agent: z.lazy(() => BaseAgentSchema).describe('Agent to run in a loop'),
  condition: z.function().args(z.unknown()).returns(z.boolean()).describe('Condition to continue looping'),
});

export type LoopAgent = z.infer<typeof LoopAgentSchema> & {
  run: (session: Session) => Promise<any>;
};

export const ToolSchema = z.object({
  name: z.string().describe('Name of the tool'),
  description: z.string().describe('Description of the tool'),
});

export type Tool = z.infer<typeof ToolSchema> & {
  run: (input: any, context: ToolContext) => Promise<any>;
};

export const ToolContextSchema = z.object({
  session: SessionSchema,
});

export type ToolContext = z.infer<typeof ToolContextSchema> & {
  getAuthResponse: () => AuthResponse | null;
  requestCredential: (authConfig: AuthConfig) => Promise<void>;
};

export const AuthConfigSchema = z.object({
  type: z.enum(['api_key', 'oauth2']).describe('Type of authentication'),
  // Add more specific fields based on the auth type
});

export type AuthConfig = z.infer<typeof AuthConfigSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string().describe('Access token for authentication'),
  refreshToken: z.string().optional().describe('Refresh token for authentication'),
  expiresAt: z.number().optional().describe('Expiration timestamp for the access token'),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const AgentTypeSchema = z.enum(['LlmAgent', 'SequentialAgent', 'ParallelAgent', 'LoopAgent']);
export type AgentType = z.infer<typeof AgentTypeSchema>;
