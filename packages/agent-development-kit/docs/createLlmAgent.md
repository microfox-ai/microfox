## Function: `createLlmAgent`

Creates an LLM agent with the provided configuration.

**Purpose:**
Creates a new LlmAgent instance.

**Parameters:**
- `config`: object - Configuration for the LLM agent.
  - `name`: string - The name of the agent.
  - `description`: string (optional) - A description of the agent.
  - `parentAgent`: BaseAgent (optional) - The parent agent, if any.
  - `subAgents`: array<BaseAgent> - An array of sub-agents.
  - `beforeAgentCallback`: function (optional) - Callback function to be executed before the agent runs.
    - `event`: Event - The event triggering the callback.
  - `afterAgentCallback`: function (optional) - Callback function to be executed after the agent runs.
    - `event`: Event - The event triggering the callback.
  - `model`: string - The name of the LLM model to use.
  - `instruction`: string (optional) - Instructions for the LLM.
  - `globalInstruction`: string (optional) - Global instructions for the LLM.
  - `tools`: array<Tool> - An array of tools available to the agent.
  - `planner`: any (optional) - A planner object.
  - `codeExecutor`: any (optional) - A code executor object.
  - `inputSchema`: any (optional) - Input schema for validation.
  - `outputSchema`: any (optional) - Output schema for validation.
  - `beforeModelCallback`: function (optional) - Callback function to be executed before the model runs.
    - `event`: Event - The event triggering the callback.
  - `afterModelCallback`: function (optional) - Callback function to be executed after the model runs.
    - `event`: Event - The event triggering the callback.
  - `beforeToolCallback`: function (optional) - Callback function to be executed before a tool runs.
    - `event`: Event - The event triggering the callback.
  - `afterToolCallback`: function (optional) - Callback function to be executed after a tool runs.
    - `event`: Event - The event triggering the callback.

**Return Value:**
- `LlmAgent` - The created LLM agent.

**Examples:**
```typescript
// Example 1: Minimal usage
const llmAgent = sdk.createLlmAgent({
  name: 'myLlmAgent',
  model: 'gpt-3',
  subAgents: [],
  tools: [],
});

// Example 2: With optional parameters
const llmAgentWithOptions = sdk.createLlmAgent({
  name: 'myLlmAgentWithOptions',
  description: 'An LLM agent with options',
  model: 'gpt-4',
  instruction: 'Answer the following question',
  subAgents: [],
  tools: [],
  // ... other optional parameters
});
```