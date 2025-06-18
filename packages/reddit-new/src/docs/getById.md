## Function: `getById`

Part of the `listings` section. Gets a listing of posts by their fullnames.

### Parameters
- An object with the following properties:

| Name  | Type   | Description                               |
|-------|--------|-------------------------------------------|
| names | string | A comma-separated list of link fullnames. |

### Return Value
- A `Promise` that resolves to a `ThingListing` of posts.

### Example
```javascript
// Example: Get posts by their fullnames
const posts = await redditSdk.api.listings.getById({ names: 't3_q4z1q,t3_q4z2r' });
console.log(posts);
``` 