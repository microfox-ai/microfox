## Function: `runAgent`

Runs an agent within a session.

**Purpose:**
Executes the given agent, using the session context.

**Parameters:**
- `agent`: BaseAgent, required. The agent to run.
  - `name`: string. Name of the agent.
  - `description`: string, optional. Description of the agent.
  - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this agent.  Each sub-agent follows the same structure as `agent`.
  - `run`: function(session: Session): Promise<any>. Function to execute the agent.
- `session`: Session, required. The session to run the agent in.
  - `id`: string. Unique identifier for the session.
  - `state`: Record<string, unknown>. Current state of the session.
  - `events`: array<Event>. List of events in the session.
    - `id`: string. Unique identifier for the event.
    - `timestamp`: Date. Timestamp of when the event occurred.
    - `author`: string. Author of the event.
    - `actions`: array<unknown>. Actions associated with the event.

**Return Value:**
- `Promise<any>`: A promise that resolves to the agent's output.

**Examples:**
```typescript
// Example using a simple agent configuration
const agent = adk.createLlmAgent({
  model: "gpt-3.5-turbo",
  tools: [],
  instructions: "Write a short story.",
});
const result = await adk.runAgent(agent, session);
console.log(result);
```