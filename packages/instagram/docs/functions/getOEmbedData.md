## Function: `getOEmbedData`

Gets oEmbed data for an Instagram post.

**Parameters:**

- `oembedData`: object - The oEmbed data.
  - `url`: string - URL of the Instagram post to embed.
  - `maxwidth`: number (optional) - Maximum width of the embedded content.
  - `fields`: array<string> (optional) - Specific fields to include in the response.
  - `omit_script`: boolean (optional) - Whether to omit the script tag in the response.

**Return Value:**

- `Promise<any>` - The oEmbed data.

**Examples:**

```typescript
const oembedData = await instagramSDK.getOEmbedData({
  url: 'https://www.instagram.com/p/<postId>/',
});
```
