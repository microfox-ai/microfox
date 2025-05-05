## TypeScript SDK for Agent Development Kit (ADK)

This document outlines the structure and components for a TypeScript SDK based on the Python ADK documentation.  The documentation focuses on the core concepts and structures, omitting specific API calls for services like Google Calendar, as those would be handled by their respective TypeScript client libraries. The focus is on the ADK interaction and authentication flow.

**Core Concepts:**

* **Agent:** The core unit of work.  The SDK will have an `Agent` base class and specialized agent classes like `LlmAgent`, `SequentialAgent`, `ParallelAgent`, and `LoopAgent`.
* **Tools:** Agents use tools to perform actions. The SDK will include a `Tool` base class and implementations like `FunctionTool`, `RestApiTool`, and wrappers for specific services (e.g., a potential `GoogleCalendarTool` leveraging the Google Calendar API client library).
* **Authentication:**  A key aspect of the SDK, supporting various authentication methods. The SDK will have classes like `AuthScheme`, `AuthCredential`, and `AuthConfig` mirroring the Python structure.
* **Sessions & Memory:**  The SDK will include interfaces and classes for managing sessions (`SessionService`) and memory (`MemoryService`).
* **Events:** The SDK will use an `Event` class to represent actions and responses within a session.
* **Artifacts:**  The SDK will include an `ArtifactService` interface for managing artifacts.


**1. Agents:**

* **BaseAgent:** Abstract base class for all agents.
    * `name: string`
    * `description?: string`
    * `parentAgent?: Agent`
    * `subAgents: Agent[]`
    * `findAgent(name: string): Agent | undefined`
    * `findSubAgent(name: string): Agent | undefined`
    * `runAsync(input: any, session: Session): Promise<Event[]>`
    * `runLive(input: any, session: Session): AsyncIterable<Event>`
    * `beforeAgentCallback?: (event: Event) => void`
    * `afterAgentCallback?: (event: Event) => void`

* **LlmAgent (extends BaseAgent):**
    * `model: string` // e.g., "gemini"
    * `instruction?: string`
    * `globalInstruction?: string`
    * `tools: Tool[]`
    * `planner?: Planner`
    * `codeExecutor?: CodeExecutor`
    * `inputSchema?: any` // JSON Schema for input validation
    * `outputSchema?: any` // JSON Schema for output validation
    * `beforeModelCallback?: (event: Event) => void`
    * `afterModelCallback?: (event: Event) => void`
    * `beforeToolCallback?: (event: Event) => void`
    * `afterToolCallback?: (event: Event) => void`
    * ... other properties from Python docs

* **SequentialAgent, ParallelAgent, LoopAgent (extend BaseAgent):** Implement specific workflow logic.


**2. Tools:**

* **BaseTool:** Abstract base class for all tools.
    * `name: string`
    * `description?: string`
    * `isLongRunning: boolean`
    * `runAsync(input: any, toolContext: ToolContext): Promise<any>`

* **FunctionTool (extends BaseTool):**
    * `func: (input: any, toolContext: ToolContext) => Promise<any>`  // The user-provided function

* **RestApiTool (extends BaseTool):**  (Implementation details will depend on the HTTP client library used, e.g., `axios`, `fetch`)
    * `baseUrl: string`
    * `method: string` // 'GET', 'POST', etc.
    * `path: string`
    * `authScheme?: AuthScheme`
    * `authCredential?: AuthCredential`
    * ... other properties for headers, parameters, etc.


**3. Authentication:**

* **AuthScheme:**  (Enum or class with static members)
    * `API_KEY`
    * `HTTP`
    * `OAUTH2`
    * `OPEN_ID_CONNECT`
    * `SERVICE_ACCOUNT`

* **AuthCredential:** (Interface)
    * `authType: AuthScheme`
    * // ... other properties depending on authType (e.g., apiKey, clientId, clientSecret, etc.)

* **AuthConfig:**
    * `authScheme: AuthScheme`
    * `rawAuthCredential: AuthCredential`
    * `exchangedAuthCredential?: AuthCredential` // For storing exchanged tokens


**4. ToolContext:**

* **ToolContext:**
    * `invocationContext: any` // Provides access to session, agent, etc.
    * `getAuthResponse(): AuthCredential | undefined`
    * `requestCredential(authConfig: AuthConfig): void`
    * `state: Record<string, any>` // For storing temporary data within the session


**5. Sessions & Memory:**

* **SessionService (Interface):**
    * `createSession(appName: string, userId?: string): Promise<Session>`
    * `getSession(sessionId: string): Promise<Session | undefined>`
    * `listSessions(appName: string, userId?: string): Promise<Session[]>`
    * `closeSession(sessionId: string): Promise<void>`
    * `appendEvent(sessionId: string, event: Event): Promise<void>`
    * `listEvents(sessionId: string): Promise<Event[]>`

* **MemoryService (Interface):**
    * `addSessionToMemory(session: Session): Promise<void>`
    * `searchMemory(query: string): Promise<any[]>`

* **Session:**
    * `id: string`
    * `appName: string`
    * `userId?: string`
    * `state: Record<string, any>`
    * `events: Event[]`
    * `lastUpdateTime: Date`


**6. Events:**

* **Event:**
    * `id: string`
    * `invocationId: string`
    * `author: string` // 'agent' or 'user'
    * `timestamp: Date`
    * `actions: EventActions`
    * `content?: any` // The actual message or data
    * `isFinalResponse: boolean`


**7. Artifacts:**

* **ArtifactService (Interface):**
    * `saveArtifact(key: string, data: any, metadata?: any): Promise<void>`
    * `loadArtifact(key: string, version?: string): Promise<any | undefined>`
    * `listArtifactKeys(prefix?: string): Promise<string[]>`
    * `listVersions(key: string): Promise<string[]>`
    * `deleteArtifact(key: string, version?: string): Promise<void>`





**Example Usage (Conceptual):**

```typescript
import { LlmAgent, FunctionTool, ToolContext, Runner, InMemorySessionService } from '@google/adk';

const sessionService = new InMemorySessionService();

async function runAgent() {
  const session = await sessionService.createSession('my-app');

  const myTool = new FunctionTool({
    name: 'my-tool',
    func: async (input: any, toolContext: ToolContext) => {
      // ... tool logic ...
      // Access session state: toolContext.state
      // Request authentication: toolContext.requestCredential(...)
      return { result: 'some data' };
    },
  });


  const agent = new LlmAgent({
    model: 'gemini',
    tools: [myTool],
  });

  const runner = new Runner({ agent, sessionService });

  const events = await runner.runAsync('Hello', session);

  console.log(events);
}


runAgent();

```


This detailed summary provides a solid foundation for building a TypeScript SDK for the Agent Development Kit.  It outlines the key classes, interfaces, and data structures needed to interact with agents, tools, authentication flows, sessions, and memory.  The next step would be to implement these components using a suitable TypeScript HTTP client and potentially other supporting libraries. Remember to handle edge cases like network errors, authentication failures, and various data types in the actual implementation.
