## Function: `followPost`

Part of the `linksAndComments` section. Follows or unfollows a post, which enables notifications for new comments.

**Parameters:**

- `params`: object
  - An object containing the post fullname and follow state.
  - `fullname`: string - The fullname of the post.
  - `follow`: boolean - `true` to follow the post, `false` to unfollow.

**Return Value:**

- `Promise<void>`: A promise that resolves when the follow state has been updated.

**Usage Example:**

```typescript
// Example: Follow a post
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.followPost({
  fullname: postFullname,
  follow: true,
});

console.log(`Now following post ${postFullname}.`);
``` 