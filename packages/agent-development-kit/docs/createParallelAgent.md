## Function: `createParallelAgent`

Creates a parallel agent.

**Purpose:**
Creates a new parallel agent instance that runs sub-agents concurrently.

**Parameters:**
- `config`: Omit<ParallelAgent, 'run'>, required. The agent configuration without the `run` function.
  - `name`: string. Name of the agent.
  - `description`: string, optional. Description of the agent.
  - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this agent. Each sub-agent follows the same structure as a regular agent:
    - `name`: string. Name of the sub-agent.
    - `description`: string, optional. Description of the sub-agent.
    - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this sub-agent, and so on.
    - `run`: function(session: Session): Promise<any>. Function to execute the sub-agent.
  - `agents`: array<BaseAgent>. List of agents to run in parallel. Each agent in the array follows the same structure as a regular agent:
    - `name`: string. Name of the agent.
    - `description`: string, optional. Description of the agent.
    - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this agent, and so on.
    - `run`: function(session: Session): Promise<any>. Function to execute the agent.

**Return Value:**
- `ParallelAgent`: The created parallel agent.
  - Includes all properties from the input `config`.
  - `run`: function(session: Session): Promise<any>. Function to execute the agent.

**Examples:**
```typescript
const agent1 = adk.createLlmAgent({
  model: "gpt-3.5-turbo",
  tools: [],
  instructions: "Write a short story.",
});
const agent2 = adk.createLlmAgent({
  model: "gpt-3.5-turbo",
  tools: [],
  instructions: "Summarize the story.",
});

const parallelAgent = adk.createParallelAgent({ agents: [agent1, agent2] });
const result = await parallelAgent.run(session);
console.log(result);
```