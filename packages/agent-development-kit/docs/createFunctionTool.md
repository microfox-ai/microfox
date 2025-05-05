## Function: `createFunctionTool`

Creates a function tool with the provided configuration.

**Purpose:**
Creates a new FunctionTool instance, which wraps a given function.

**Parameters:**
- `config`: object - Configuration for the function tool.
  - `name`: string - The name of the tool.
  - `description`: string (optional) - A description of the tool.
  - `isLongRunning`: boolean - Whether the tool is long-running.
  - `func`: function - The function to be wrapped by the tool.
    - Takes two arguments:
      - `input`: any - The input to the function.
      - `toolContext`: ToolContext - The context for the tool execution.
    - Returns a Promise that resolves to any value.

**Return Value:**
- `FunctionTool` - The created function tool.

**Examples:**
```typescript
// Example 1: Minimal usage
const myFunction = async (input: any, toolContext: ToolContext) => {
  return `Input: ${input}`;
};

const functionTool = sdk.createFunctionTool({
  name: 'myFunctionTool',
  isLongRunning: false,
  func: myFunction,
});

// Example 2: With optional description
const anotherFunction = async (input: any, toolContext: ToolContext) => {
  return input * 2;
};

const functionToolWithDescription = sdk.createFunctionTool({
  name: 'myFunctionToolWithDescription',
  description: 'A function tool with a description',
  isLongRunning: true,
  func: anotherFunction,
});
```