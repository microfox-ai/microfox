## Function: `createLoopAgent`

Creates a loop agent.

**Purpose:**
Creates a new loop agent instance that runs a sub-agent repeatedly based on a condition.

**Parameters:**
- `config`: Omit<LoopAgent, 'run'>, required. The agent configuration without the `run` function.
  - `name`: string. Name of the agent.
  - `description`: string, optional. Description of the agent.
  - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this agent. Each sub-agent follows the same structure as a regular agent:
    - `name`: string. Name of the sub-agent.
    - `description`: string, optional. Description of the sub-agent.
    - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this sub-agent, and so on.
    - `run`: function(session: Session): Promise<any>. Function to execute the sub-agent.
  - `agent`: BaseAgent. Agent to run in a loop. The agent follows the same structure as a regular agent:
    - `name`: string. Name of the agent.
    - `description`: string, optional. Description of the agent.
    - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this agent, and so on.
    - `run`: function(session: Session): Promise<any>. Function to execute the agent.
  - `condition`: function(unknown): boolean. Condition to continue looping.

**Return Value:**
- `LoopAgent`: The created loop agent.
  - Includes all properties from the input `config`.
  - `run`: function(session: Session): Promise<any>. Function to execute the agent.

**Examples:**
```typescript
const agent = adk.createLlmAgent({
  model: "gpt-3.5-turbo",
  tools: [],
  instructions: "Write a short story.",
});

const loopAgent = adk.createLoopAgent({
  agent: agent,
  condition: (result) => result.length < 1000,
});
const result = await loopAgent.run(session);
console.log(result);
```