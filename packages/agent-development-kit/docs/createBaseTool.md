## Function: `createBaseTool`

Creates a base tool with the provided configuration.

**Purpose:**
Creates a new BaseTool instance.

**Parameters:**
- `config`: object - Configuration for the base tool.
  - `name`: string - The name of the tool.
  - `description`: string (optional) - A description of the tool.
  - `isLongRunning`: boolean - Whether the tool is long-running.

**Return Value:**
- `BaseTool` - The created base tool.

**Examples:**
```typescript
// Example 1: Minimal usage
const baseTool = sdk.createBaseTool({
  name: 'myTool',
  isLongRunning: false,
});

// Example 2: With optional description
const baseToolWithDescription = sdk.createBaseTool({
  name: 'myToolWithDescription',
  description: 'A base tool with a description',
  isLongRunning: true,
});
```