## Function: `getContentPublishingLimit`

Gets the content publishing limit for an Instagram Business Account.

**Parameters:**

- `igId` (string, required): The Instagram Business Account ID.

**Return Value:**

- `Promise<any>`: The response from the API.

**Examples:**

```typescript
const limit = await sdk.getContentPublishingLimit('<igId>');
console.log(limit);
```
