## Function: `checkMediaStatus`

Checks the status of a media container.

**Parameters:**

- `igContainerId` (string, required): The ID of the media container.

**Return Value:**

- `Promise<object>`:
  - `status_code` (StatusCode): The status code of the media. Possible values: 'PUBLISHED', 'IN_PROGRESS', 'FINISHED', 'ERROR', 'EXPIRED'.

**Examples:**

```typescript
const status = await sdk.checkMediaStatus('<igContainerId>');
console.log(status.status_code);
```
