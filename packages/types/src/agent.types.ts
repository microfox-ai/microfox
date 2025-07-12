export interface AgentInfo {
  /**
   * The version of the A2A protocol this agent supports.
   * @default "0.2.5"
   */
  protocolVersion: string;
  /**
   * Human readable name of the agent.
   * @TJS-examples ["Recipe Agent"]
   */
  name: string;
  /**
   * A human-readable description of the agent. Used to assist users and
   * other agents in understanding what the agent can do.
   * @TJS-examples ["Agent that helps users with recipes and cooking."]
   */
  description: string;
  /** A URL to an icon for the agent. */
  iconUrl?: string;
  /** The service provider of the agent */
  provider?: AgentProvider;
  /**
   * The version of the agent - format is up to the provider.
   * @TJS-examples ["1.0.0"]
   */
  version: string;
  /** A URL to documentation for the agent. */
  documentationUrl?: string;
}

/**
 * Represents the service provider of an agent.
 * @TJS-examples [{ "organization": "Google", "url": "https://ai.google.dev" }]
 */
export interface AgentProvider {
  /** Agent provider's organization name. */
  organization: string;
  /** Agent provider's URL. */
  url: string;
}

/**
 * Defines optional capabilities supported by an agent.
 */
export interface AgentCapabilities {
  /** true if the agent supports SSE. */
  streaming?: boolean;
  /** true if the agent can notify updates to client. */
  pushNotifications?: boolean;
  /** true if the agent exposes status change history for tasks. */
  stateTransitionHistory?: boolean;
  /** extensions supported by this agent. */
  extensions?: AgentExtension[];
}

/**
 * A declaration of an extension supported by an Agent.
 * @TJS-examples [{"uri": "https://developers.google.com/identity/protocols/oauth2", "description": "Google OAuth 2.0 authentication", "required": false}]
 */
export interface AgentExtension {
  /** The URI of the extension. */
  uri: string;
  /** A description of how this agent uses this extension. */
  description?: string;
  /** Whether the client must follow specific requirements of the extension. */
  required?: boolean;
  /** Optional configuration for the extension. */
  params?: { [key: string]: any };
}

/**
 * Mirrors the OpenAPI Security Scheme Object
 * (https://swagger.io/specification/#security-scheme-object)
 */
export type SecurityScheme =
  | APIKeySecurityScheme
  | HTTPAuthSecurityScheme
  | OAuth2SecurityScheme
  | OpenIdConnectSecurityScheme;

/**
 * Represents a unit of capability that an agent can perform.
 */
export interface AgentSkill {
  /** Unique identifier for the agent's skill. */
  id: string;
  /** Human readable name of the skill. */
  name: string;
  /**
   * Description of the skill - will be used by the client or a human
   * as a hint to understand what the skill does.
   */
  description: string;
  /**
   * Set of tagwords describing classes of capabilities for this specific skill.
   * @TJS-examples [["cooking", "customer support", "billing"]]
   */
  tags: string[];
  /**
   * The set of example scenarios that the skill can perform.
   * Will be used by the client as a hint to understand how the skill can be used.
   * @TJS-examples [["I need a recipe for bread"]]
   */
  examples?: string[]; // example prompts for tasks
  /**
   * The set of interaction modes that the skill supports
   * (if different than the default).
   * Supported media types for input.
   */
  inputModes?: string[];
  /** Supported media types for output. */
  outputModes?: string[];
}

/**
 * AgentInterface provides a declaration of a combination of the
 * target url and the supported transport to interact with the agent.
 */
export interface AgentInterface {
  url: string; // the url this interface is found at
  /**
   * The transport supported this url. This is an open form string, to be
   * easily extended for many transport protocols. The core ones officially
   * supported are JSONRPC, GRPC and HTTP+JSON.
   */
  transport: string;
}

export interface AgentServers {
  url: string;
  description: string;
}

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
