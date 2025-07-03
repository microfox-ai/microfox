## Function: `getMediaContainerStatus`

Gets the status of a media container.

**Parameters:**

- `containerId`: string - The ID of the media container.

**Return Value:**

- `Promise<string>` - The status code of the media container.

**Examples:**

```typescript
const status = await instagramSDK.getMediaContainerStatus('<containerId>');
```
