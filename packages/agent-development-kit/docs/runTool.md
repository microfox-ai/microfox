## Function: `runTool`

Runs a tool within a session.

**Purpose:**
Executes a specific tool with the given input and session context.

**Parameters:**
- `toolName`: string, required. The name of the tool to run.
- `sessionId`: string, required. The ID of the session.
- `input`: any, required. The input to provide to the tool.

**Return Value:**
- `Promise<any>`: A promise that resolves to the tool's output.

**Examples:**
```typescript
const result = await adk.runTool("myTool", "sessionId123", { data: "someData" });
console.log(result);
```