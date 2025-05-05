## Function: `createLoopAgent`

Creates a loop agent with the provided configuration.

**Purpose:**
Creates a new LoopAgent instance. This agent executes its sub-agents in a loop, based on a condition or counter.

**Parameters:**
- `config`: object - Configuration for the loop agent.
  - `name`: string - The name of the agent.
  - `description`: string (optional) - A description of the agent.
  - `parentAgent`: BaseAgent (optional) - The parent agent, if any.
  - `subAgents`: array<BaseAgent> - An array of sub-agents to be executed in the loop.
  - `beforeAgentCallback`: function (optional) - Callback function to be executed before the agent runs.
    - `event`: Event - The event triggering the callback.
  - `afterAgentCallback`: function (optional) - Callback function to be executed after the agent runs.
    - `event`: Event - The event triggering the callback.

**Return Value:**
- `LoopAgent` - The created loop agent.

**Examples:**
```typescript
// Example 1: Minimal usage
const loopAgent = sdk.createLoopAgent({
  name: 'myLoopAgent',
  subAgents: [],
});

// Example 2: With optional parameters and sub-agents
const subAgent1 = sdk.createBaseAgent({ name: 'subAgent1', subAgents: [] });
const subAgent2 = sdk.createBaseAgent({ name: 'subAgent2', subAgents: [] });

const loopAgentWithOptions = sdk.createLoopAgent({
  name: 'myLoopAgentWithOptions',
  description: 'A loop agent with options',
  subAgents: [subAgent1, subAgent2],
  beforeAgentCallback: (event) => {
    console.log('Before agent callback', event);
  },
  afterAgentCallback: (event) => {
    console.log('After agent callback', event);
  },
});
```