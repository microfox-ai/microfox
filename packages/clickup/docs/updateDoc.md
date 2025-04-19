# updateDoc

Updates an existing doc.

## Parameters

- **workspaceId** (string): The ID of the workspace.
- **docId** (string): The ID of the doc to update.
- **params** (UpdateDocParams): An object containing the updated doc details.
  - **title** (string, optional): The new title of the doc.
  - **content** (string, optional): The new content of the doc.

## Return Type

Promise<DocResponse>

## Usage Example

```typescript
const updatedDoc = await clickUp.updateDoc('YOUR_WORKSPACE_ID', 'YOUR_DOC_ID', { title: 'Updated Doc Title', content: 'Updated doc content.' });
console.log(updatedDoc);
```