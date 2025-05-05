## Function: `createLlmAgent`

Creates an LLM agent.

**Purpose:**
Creates a new LLM agent instance.

**Parameters:**
- `config`: Omit<LlmAgent, 'run'>, required. The agent configuration without the `run` function.
  - `name`: string. Name of the agent.
  - `description`: string, optional. Description of the agent.
  - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this agent. Each sub-agent follows the same structure as a regular agent:
    - `name`: string. Name of the sub-agent.
    - `description`: string, optional. Description of the sub-agent.
    - `sub_agents`: array<BaseAgent>, optional. Sub-agents of this sub-agent, and so on.
    - `run`: function(session: Session): Promise<any>. Function to execute the sub-agent.
  - `model`: string. LLM model to use.
  - `tools`: array<Tool>. Tools available to the agent.
    - `name`: string. Name of the tool.
    - `description`: string. Description of the tool.
    - `run`: function(input: any, context: ToolContext): Promise<any>. Function to execute the tool.
  - `instructions`: string. Instructions for the agent.
  - `examples`: array<string>, optional. Example interactions.

**Return Value:**
- `LlmAgent`: The created LLM agent.
  - Includes all properties from the input `config`.
  - `run`: function(session: Session): Promise<any>. Function to execute the agent.

**Examples:**
```typescript
const agent = adk.createLlmAgent({
  model: "gpt-3.5-turbo",
  tools: [],
  instructions: "Write a short story.",
});

const result = await agent.run(session);
console.log(result);
```