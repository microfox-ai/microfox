# enableDisableComments

Enables or disables comments on a media object.

## Parameters

- `igMediaId` (string): The ID of the media object.
- `commentsEnabled` (boolean): Whether to enable comments (`true`) or disable them (`false`).

## Returns

- `Promise<void>`: A promise that resolves when the comments have been enabled or disabled.

## Example

```typescript
await sdk.enableDisableComments('media_id', false);
```
