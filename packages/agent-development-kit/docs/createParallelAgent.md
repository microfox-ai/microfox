## Function: `createParallelAgent`

Creates a parallel agent with the provided configuration.

**Purpose:**
Creates a new ParallelAgent instance. This agent executes its sub-agents in parallel.

**Parameters:**
- `config`: object - Configuration for the parallel agent.
  - `name`: string - The name of the agent.
  - `description`: string (optional) - A description of the agent.
  - `parentAgent`: BaseAgent (optional) - The parent agent, if any.
  - `subAgents`: array<BaseAgent> - An array of sub-agents to be executed in parallel.
  - `beforeAgentCallback`: function (optional) - Callback function to be executed before the agent runs.
    - `event`: Event - The event triggering the callback.
  - `afterAgentCallback`: function (optional) - Callback function to be executed after the agent runs.
    - `event`: Event - The event triggering the callback.

**Return Value:**
- `ParallelAgent` - The created parallel agent.

**Examples:**
```typescript
// Example 1: Minimal usage
const parallelAgent = sdk.createParallelAgent({
  name: 'myParallelAgent',
  subAgents: [],
});

// Example 2: With optional parameters and sub-agents
const subAgent1 = sdk.createBaseAgent({ name: 'subAgent1', subAgents: [] });
const subAgent2 = sdk.createBaseAgent({ name: 'subAgent2', subAgents: [] });

const parallelAgentWithOptions = sdk.createParallelAgent({
  name: 'myParallelAgentWithOptions',
  description: 'A parallel agent with options',
  subAgents: [subAgent1, subAgent2],
  beforeAgentCallback: (event) => {
    console.log('Before agent callback', event);
  },
  afterAgentCallback: (event) => {
    console.log('After agent callback', event);
  },
});
```