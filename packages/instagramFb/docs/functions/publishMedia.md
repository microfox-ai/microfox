## Function: `publishMedia`

Publishes a media container.

**Parameters:**

- `igId` (string, required): The Instagram Business Account ID.
- `creationId` (string, required): The ID of the media container to publish.

**Return Value:**

- `Promise<object>`:
  - `id` (string): The ID of the published media.

**Examples:**

```typescript
const publishedMedia = await sdk.publishMedia('<igId>', '<creationId>');
console.log(publishedMedia.id);
```
