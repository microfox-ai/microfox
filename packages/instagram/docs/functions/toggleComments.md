## Function: `toggleComments`

Enables or disables comments on a media object.

**Parameters:**

- `mediaId`: string - The ID of the media object.
- `enable`: boolean - Whether to enable comments.

**Return Value:**

- `Promise<void>`

**Examples:**

```typescript
await instagramSDK.toggleComments('<mediaId>', true);
```
