# createDoc

Creates a new doc.

## Parameters

- **workspaceId** (string): The ID of the workspace to create the doc in.
- **params** (CreateDocParams): An object containing the doc details.
  - **title** (string): The title of the doc.
  - **content** (string): The content of the doc.

## Return Type

Promise<DocResponse>

## Usage Example

```typescript
const newDoc = await clickUp.createDoc('YOUR_WORKSPACE_ID', { title: 'My New Doc', content: 'This is the content of my new doc.' });
console.log(newDoc);
```