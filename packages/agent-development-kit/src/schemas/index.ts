import { z } from 'zod';
import {
  SessionSchema,
  EventSchema,
  BaseAgentSchema,
  LlmAgentSchema,
  SequentialAgentSchema,
  ParallelAgentSchema,
  LoopAgentSchema,
  ToolSchema,
  ToolContextSchema,
  AuthConfigSchema,
  AuthResponseSchema,
  AgentTypeSchema,
} from '../types';

export const schemas = {
  Session: SessionSchema,
  Event: EventSchema,
  BaseAgent: BaseAgentSchema,
  LlmAgent: LlmAgentSchema,
  SequentialAgent: SequentialAgentSchema,
  ParallelAgent: ParallelAgentSchema,
  LoopAgent: LoopAgentSchema,
  Tool: ToolSchema,
  ToolContext: ToolContextSchema,
  AuthConfig: AuthConfigSchema,
  AuthResponse: AuthResponseSchema,
  AgentType: AgentTypeSchema,
};

export function validateSchema<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}
