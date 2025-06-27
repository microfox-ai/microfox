## Function: `unspoiler`

Part of the `linksAndComments` section. Unmarks a post as a spoiler. This method does not return anything.

### Parameters
- An object containing the fullname of the post to unspoil.

| Name | Type   | Description        |
| ---- | ------ | ------------------ |
| id   | string | Fullname of a link |

### Example
```javascript
// Example: Unmark a post as a spoiler
await redditSdk.api.linksAndComments.unspoiler({
  id: 't3_q4q4q4',
});
``` 