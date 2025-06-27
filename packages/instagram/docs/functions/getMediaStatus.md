# getMediaStatus

Gets the status of a media container.

## Parameters

- `igContainerId` (string): The ID of the media container.

## Returns

- `Promise<MediaStatusSchema>`: A promise that resolves to the media status object.

## Example

```typescript
const status = await sdk.getMediaStatus('container_id');
console.log(status.status_code);
```
