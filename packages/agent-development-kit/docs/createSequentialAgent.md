## Function: `createSequentialAgent`

Creates a sequential agent with the provided configuration.

**Purpose:**
Creates a new SequentialAgent instance. This agent executes its sub-agents in sequential order.

**Parameters:**
- `config`: object - Configuration for the sequential agent.
  - `name`: string - The name of the agent.
  - `description`: string (optional) - A description of the agent.
  - `parentAgent`: BaseAgent (optional) - The parent agent, if any.
  - `subAgents`: array<BaseAgent> - An array of sub-agents to be executed sequentially.
  - `beforeAgentCallback`: function (optional) - Callback function to be executed before the agent runs.
    - `event`: Event - The event triggering the callback.
  - `afterAgentCallback`: function (optional) - Callback function to be executed after the agent runs.
    - `event`: Event - The event triggering the callback.

**Return Value:**
- `SequentialAgent` - The created sequential agent.

**Examples:**
```typescript
// Example 1: Minimal usage
const sequentialAgent = sdk.createSequentialAgent({
  name: 'mySequentialAgent',
  subAgents: [],
});

// Example 2: With optional parameters and sub-agents
const subAgent1 = sdk.createBaseAgent({ name: 'subAgent1', subAgents: [] });
const subAgent2 = sdk.createBaseAgent({ name: 'subAgent2', subAgents: [] });

const sequentialAgentWithOptions = sdk.createSequentialAgent({
  name: 'mySequentialAgentWithOptions',
  description: 'A sequential agent with options',
  subAgents: [subAgent1, subAgent2],
  beforeAgentCallback: (event) => {
    console.log('Before agent callback', event);
  },
  afterAgentCallback: (event) => {
    console.log('After agent callback', event);
  },
});
```