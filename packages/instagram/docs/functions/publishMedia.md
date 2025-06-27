## Function: `publishMedia`

Publishes a media container.

**Parameters:**

- `accountId`: string - The ID of the Instagram account.
- `containerId`: string - The ID of the media container.

**Return Value:**

- `Promise<string>` - The ID of the published media.

**Examples:**

```typescript
const mediaId = await instagramSDK.publishMedia('<accountId>', '<containerId>');
```
