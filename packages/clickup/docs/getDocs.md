# getDocs

Retrieves docs for a workspace.

## Parameters

- **workspaceId** (string): The ID of the workspace.

## Return Type

Promise<DocResponse>

## Usage Example

```typescript
const docs = await clickUp.getDocs('YOUR_WORKSPACE_ID');
console.log(docs);
```