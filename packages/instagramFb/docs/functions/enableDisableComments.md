## Function: `enableDisableComments`

Enables or disables comments on a media object.

**Parameters:**

- `igMediaId` (string, required): The ID of the media object.
- `commentsEnabled` (boolean, required): Whether to enable comments (`true`) or disable them (`false`).

**Return Value:**

- `Promise<any>`: The response from the API.

**Examples:**

```typescript
await sdk.enableDisableComments('<igMediaId>', false);
```
