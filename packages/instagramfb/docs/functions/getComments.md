## Function: `getComments`

Retrieves comments for a given media object.

**Parameters:**

- `igMediaId` (string, required): The ID of the media object.

**Return Value:**

- `Promise<array<Comment>>`: An array of comments.

**Examples:**

```typescript
const comments = await sdk.getComments('<igMediaId>');
console.log(comments);
```
