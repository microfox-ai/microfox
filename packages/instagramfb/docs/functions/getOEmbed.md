## Function: `getOEmbed`

Gets oEmbed data for a given URL.

**Parameters:**

- `url` (string, required): The URL to get oEmbed data for.
- `maxwidth` (number, optional): The maximum width of the embed.
- `fields` (array<string>, optional): An array of fields to include in the response.
- `omitScript` (boolean, optional): Whether to omit the script tag in the embed HTML.

**Return Value:**

- `Promise<OEmbedResponse>`: The oEmbed response object.

**Examples:**

```typescript
const oembed = await sdk.getOEmbed('<url>');
console.log(oembed);
```
