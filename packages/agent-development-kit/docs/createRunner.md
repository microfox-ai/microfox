## Function: `createRunner`

Creates a runner for executing agents.

**Purpose:**
Creates a new Runner instance that can execute agents asynchronously or in a live session.

**Parameters:**
- `config`: object - Configuration for the runner.
  - `agent`: Agent - The agent to be executed by the runner.
  - `sessionService`: SessionService - The session service to use for managing sessions.

**Return Value:**
- `Runner` - The created runner.

**Examples:**
```typescript
// Example usage
const agent = sdk.createBaseAgent({ name: 'myAgent', subAgents: [] });
const sessionService = {} as SessionService; // Replace with your actual session service

const runner = sdk.createRunner({
  agent,
  sessionService,
});
```