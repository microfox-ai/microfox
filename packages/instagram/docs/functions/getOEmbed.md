# getOEmbed

Retrieves oEmbed data for a given URL.

## Parameters

- `url` (string): The URL to retrieve oEmbed data for.
- `maxwidth` (number, optional): The maximum width of the embedded content.
- `omitScript` (boolean, optional): Whether to omit the script tag in the oEmbed HTML.

## Returns

- `Promise<OEmbedResponseSchema>`: A promise that resolves to the oEmbed response object.

## Example

```typescript
const oembed = await sdk.getOEmbed('https://www.instagram.com/p/post_id/');
console.log(oembed.html);
```
