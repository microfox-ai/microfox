## Function: `createBaseAgent`

Creates a base agent with the provided configuration.

**Purpose:**
Creates a new BaseAgent instance.

**Parameters:**
- `config`: object - Configuration for the base agent.
  - `name`: string - The name of the agent.
  - `description`: string (optional) - A description of the agent.
  - `parentAgent`: BaseAgent (optional) - The parent agent, if any.
  - `subAgents`: array<BaseAgent> - An array of sub-agents.
  - `beforeAgentCallback`: function (optional) - Callback function to be executed before the agent runs.
    - `event`: Event - The event triggering the callback.
  - `afterAgentCallback`: function (optional) - Callback function to be executed after the agent runs.
    - `event`: Event - The event triggering the callback.

**Return Value:**
- `BaseAgent` - The created base agent.

**Examples:**
```typescript
// Example 1: Minimal usage
const baseAgent = sdk.createBaseAgent({
  name: 'myAgent',
  subAgents: [],
});

// Example 2: With optional parameters
const baseAgentWithOptions = sdk.createBaseAgent({
  name: 'myAgentWithOptions',
  description: 'A base agent with options',
  subAgents: [],
  beforeAgentCallback: (event) => {
    console.log('Before agent callback', event);
  },
  afterAgentCallback: (event) => {
    console.log('After agent callback', event);
  },
});
```