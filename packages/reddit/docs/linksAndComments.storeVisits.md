## Function: `storeVisits`

Part of the `linksAndComments` section. Records that the user has visited a set of links.

**Parameters:**

- `params`: object
  - An object containing the links to mark as visited.
  - `links`: string - A comma-separated list of link fullnames.

**Return Value:**

- `Promise<void>`: A promise that resolves when the visits have been recorded.

**Usage Example:**

```typescript
// Example: Mark two links as visited
const linkFullnames = 't3_linkid1,t3_linkid2';

await redditSdk.api.linksAndComments.storeVisits({
  links: linkFullnames,
});

console.log('Visits have been recorded.');
``` 