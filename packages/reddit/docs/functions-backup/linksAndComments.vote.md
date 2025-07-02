## Function: `vote`

Part of the `linksAndComments` section. Casts a vote on a post or comment.

**Parameters:**

- `dir` ('1' | '0' | '-1'): The direction of the vote. '1' for upvote, '0' for no vote, '-1' for downvote.
- `id` (string): The fullname of the thing to vote on.
- `rank` (number, optional): The rank of the vote. Must be an integer greater than 1.

**Return Value:**

- `Promise<void>`: A promise that resolves when the vote has been successfully cast.

**Usage Example:**

```javascript
// Example: Upvote a post
await redditSdk.api.linksAndComments.vote({
  id: 't3_q4q4q4',
  dir: '1',
});
```
