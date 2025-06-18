## Function: `getMoreChildren`

Part of the `linksAndComments` section. Used to fetch more comments from a comment tree, typically when a "load more" or "continue this thread" link is present.

**Parameters:**

- `params`: object
  - An object containing the necessary details to fetch the additional comments.
  - `link_id`: string - The fullname of the post to which the comments belong.
  - `children`: string - A comma-separated list of comment IDs to retrieve.
  - `sort`: string (optional) - The sorting method for the comments (e.g., `confidence`, `top`, `new`, `controversial`, `old`, `random`, `qa`).

**Return Value:**

- `Promise<any>`: A promise that resolves to an object containing the newly fetched comments.

**Usage Example:**

```typescript
// Example: Load more comments for a specific post
const postId = 't3_postid';
const commentIds = 'commentid1,commentid2';

const moreComments = await redditSdk.api.linksAndComments.getMoreChildren({
  link_id: postId,
  children: commentIds,
  sort: 'new',
});

console.log('Fetched additional comments:', moreComments);
``` 