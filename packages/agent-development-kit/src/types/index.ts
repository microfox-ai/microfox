import { z } from 'zod';

export const AuthSchemeEnum = z.enum(['API_KEY', 'HTTP', 'OAUTH2', 'OPEN_ID_CONNECT', 'SERVICE_ACCOUNT']);
export type AuthScheme = z.infer<typeof AuthSchemeEnum>;

export const AuthCredentialSchema = z.object({
  authType: AuthSchemeEnum,
  // Additional properties will be added based on authType
}).describe('Authentication credential');
export type AuthCredential = z.infer<typeof AuthCredentialSchema>;

export const AuthConfigSchema = z.object({
  authScheme: AuthSchemeEnum,
  rawAuthCredential: AuthCredentialSchema,
  exchangedAuthCredential: AuthCredentialSchema.optional(),
}).describe('Authentication configuration');
export type AuthConfig = z.infer<typeof AuthConfigSchema>;

export const EventSchema = z.object({
  id: z.string(),
  invocationId: z.string(),
  author: z.enum(['agent', 'user']),
  timestamp: z.date(),
  actions: z.any(), // EventActions - to be defined
  content: z.any().optional(),
  isFinalResponse: z.boolean(),
}).describe('Event representing actions and responses within a session');
export type Event = z.infer<typeof EventSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  appName: z.string(),
  userId: z.string().optional(),
  state: z.record(z.string(), z.any()),
  events: z.array(EventSchema),
  lastUpdateTime: z.date(),
}).describe('Session information');
export type Session = z.infer<typeof SessionSchema>;

export const ToolContextSchema = z.object({
  invocationContext: z.any(),
  getAuthResponse: z.function().returns(z.union([AuthCredentialSchema, z.undefined()])),
  requestCredential: z.function().args(AuthConfigSchema).returns(z.void()),
  state: z.record(z.string(), z.any()),
}).describe('Context for tool execution');
export type ToolContext = z.infer<typeof ToolContextSchema>;

export const BaseToolSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  isLongRunning: z.boolean(),
  runAsync: z.function().args(z.any(), ToolContextSchema).returns(z.promise(z.any())),
}).describe('Base tool interface');
export type BaseTool = z.infer<typeof BaseToolSchema>;

export const FunctionToolSchema = BaseToolSchema.extend({
  func: z.function().args(z.any(), ToolContextSchema).returns(z.promise(z.any())),
}).describe('Function-based tool');
export type FunctionTool = z.infer<typeof FunctionToolSchema>;

export const RestApiToolSchema = BaseToolSchema.extend({
  baseUrl: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  path: z.string(),
  authScheme: AuthSchemeEnum.optional(),
  authCredential: AuthCredentialSchema.optional(),
}).describe('REST API tool');
export type RestApiTool = z.infer<typeof RestApiToolSchema>;

export const ToolSchema = z.union([BaseToolSchema, FunctionToolSchema, RestApiToolSchema]);
export type Tool = z.infer<typeof ToolSchema>;

export const BaseAgentSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  parentAgent: z.lazy(() => BaseAgentSchema).optional(),
  subAgents: z.array(z.lazy(() => BaseAgentSchema)),
  findAgent: z.function().args(z.string()).returns(z.lazy(() => BaseAgentSchema).or(z.undefined())),
  findSubAgent: z.function().args(z.string()).returns(z.lazy(() => BaseAgentSchema).or(z.undefined())),
  runAsync: z.function().args(z.any(), SessionSchema).returns(z.promise(z.array(EventSchema))),
  runLive: z.function().args(z.any(), SessionSchema).returns(z.any()), // AsyncIterable<Event>
  beforeAgentCallback: z.function().args(EventSchema).returns(z.void()).optional(),
  afterAgentCallback: z.function().args(EventSchema).returns(z.void()).optional(),
}).describe('Base agent interface');
export type BaseAgent = z.infer<typeof BaseAgentSchema>;

export const LlmAgentSchema = BaseAgentSchema.extend({
  model: z.string(),
  instruction: z.string().optional(),
  globalInstruction: z.string().optional(),
  tools: z.array(ToolSchema),
  planner: z.any().optional(), // Planner - to be defined
  codeExecutor: z.any().optional(), // CodeExecutor - to be defined
  inputSchema: z.any().optional(),
  outputSchema: z.any().optional(),
  beforeModelCallback: z.function().args(EventSchema).returns(z.void()).optional(),
  afterModelCallback: z.function().args(EventSchema).returns(z.void()).optional(),
  beforeToolCallback: z.function().args(EventSchema).returns(z.void()).optional(),
  afterToolCallback: z.function().args(EventSchema).returns(z.void()).optional(),
}).describe('LLM-based agent');
export type LlmAgent = z.infer<typeof LlmAgentSchema>;

export const SequentialAgentSchema = BaseAgentSchema.describe('Sequential workflow agent');
export type SequentialAgent = z.infer<typeof SequentialAgentSchema>;

export const ParallelAgentSchema = BaseAgentSchema.describe('Parallel workflow agent');
export type ParallelAgent = z.infer<typeof ParallelAgentSchema>;

export const LoopAgentSchema = BaseAgentSchema.describe('Loop workflow agent');
export type LoopAgent = z.infer<typeof LoopAgentSchema>;

export const AgentSchema = z.union([BaseAgentSchema, LlmAgentSchema, SequentialAgentSchema, ParallelAgentSchema, LoopAgentSchema]);
export type Agent = z.infer<typeof AgentSchema>;

export const SessionServiceSchema = z.object({
  createSession: z.function().args(z.string(), z.string().optional()).returns(z.promise(SessionSchema)),
  getSession: z.function().args(z.string()).returns(z.promise(SessionSchema.or(z.undefined()))),
  listSessions: z.function().args(z.string(), z.string().optional()).returns(z.promise(z.array(SessionSchema))),
  closeSession: z.function().args(z.string()).returns(z.promise(z.void())),
  appendEvent: z.function().args(z.string(), EventSchema).returns(z.promise(z.void())),
  listEvents: z.function().args(z.string()).returns(z.promise(z.array(EventSchema))),
}).describe('Session management service');
export type SessionService = z.infer<typeof SessionServiceSchema>;

export const MemoryServiceSchema = z.object({
  addSessionToMemory: z.function().args(SessionSchema).returns(z.promise(z.void())),
  searchMemory: z.function().args(z.string()).returns(z.promise(z.array(z.any()))),
}).describe('Memory management service');
export type MemoryService = z.infer<typeof MemoryServiceSchema>;

export const ArtifactServiceSchema = z.object({
  saveArtifact: z.function().args(z.string(), z.any(), z.any().optional()).returns(z.promise(z.void())),
  loadArtifact: z.function().args(z.string(), z.string().optional()).returns(z.promise(z.any().or(z.undefined()))),
  listArtifactKeys: z.function().args(z.string().optional()).returns(z.promise(z.array(z.string()))),
  listVersions: z.function().args(z.string()).returns(z.promise(z.array(z.string()))),
  deleteArtifact: z.function().args(z.string(), z.string().optional()).returns(z.promise(z.void())),
}).describe('Artifact management service');
export type ArtifactService = z.infer<typeof ArtifactServiceSchema>;

export const RunnerSchema = z.object({
  runAsync: z.function().args(z.any(), SessionSchema).returns(z.promise(z.array(EventSchema))),
  runLive: z.function().args(z.any(), SessionSchema).returns(z.any()), // AsyncIterable<Event>
}).describe('Runner for executing agents');
export type Runner = z.infer<typeof RunnerSchema>;
