## Function: `createSequentialAgent`

Creates a sequential agent.

**Purpose:**
Creates a new sequential agent instance that runs sub-agents in order.

**Parameters:**
- `config`: Omit<SequentialAgent, 'run'>, required. The agent configuration without the `run` function.
  - `name`: string. Name of the agent.
  - `description`: string, optional. Description of the agent.
  - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this agent. Each sub-agent follows the same structure as a regular agent:
    - `name`: string. Name of the sub-agent.
    - `description`: string, optional. Description of the sub-agent.
    - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this sub-agent, and so on.
    - `run`: function(session: Session): Promise<any>. Function to execute the sub-agent.
  - `agents`: array<BaseAgent>. Ordered list of agents to run sequentially. Each agent in the array follows the same structure as a regular agent:
    - `name`: string. Name of the agent.
    - `description`: string, optional. Description of the agent.
    - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this agent, and so on.
    - `run`: function(session: Session): Promise<any>. Function to execute the agent.

**Return Value:**
- `SequentialAgent`: The created sequential agent.
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
  instructions: "Translate the story to French.",
});

const sequentialAgent = adk.createSequentialAgent({ agents: [agent1, agent2] });
const result = await sequentialAgent.run(session);
console.log(result);
```