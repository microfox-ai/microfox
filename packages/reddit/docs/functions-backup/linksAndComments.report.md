## Function: `report`

Part of the `linksAndComments` section. Reports a thing (e.g., a post or comment) for breaking Reddit's rules.

**Parameters:**

- `params`: object
  - An object containing the details of the report.
  - `thing_id`: string - The fullname of the thing being reported.
  - `reason`: string - A specific reason for the report.

**Return Value:**

- `Promise<void>`: A promise that resolves when the report has been successfully submitted.

**Usage Example:**

```typescript
// Example: Report a comment for spam
const commentFullname = 't1_commentid';

await redditSdk.api.linksAndComments.report({
  thing_id: commentFullname,
  reason: 'Spam',
});

console.log(`Comment ${commentFullname} has been reported.`);
``` 