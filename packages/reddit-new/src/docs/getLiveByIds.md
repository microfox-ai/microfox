## Function: `getLiveByIds`

Part of the `liveThreads` section. Gets one or more live threads by their fullnames or IDs.

### Parameters
- An object with the following properties:

| Name | Type | Description |
|---|---|---|
| names | string | A comma-delimited list of live thread fullnames or IDs. |

### Return Value
- A `Promise` that resolves to a `ThingListing` of live threads.

### Example
```javascript
// Example: Get live threads by their IDs
const liveThreads = await redditSdk.api.liveThreads.getLiveByIds({ names: '123,456' });
console.log(liveThreads);
``` 