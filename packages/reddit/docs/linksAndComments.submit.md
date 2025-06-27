## Function: `submit`

Part of the `linksAndComments` section. Submits a new post to a subreddit.

**Parameters:**

- `params`: object
  - An object containing the details of the post to submit.
  - `sr`: string - The name of the subreddit to submit to.
  - `kind`: 'self' | 'link' - The type of post.
  - `title`: string - The title of the post.
  - `text`: string (optional) - The text content of a self-post. Required if `kind` is 'self'.
  - `url`: string (optional) - The URL for a link post. Required if `kind` is 'link'.
  - `sendreplies`: boolean (optional) - Whether to enable inbox replies for the post. Defaults to `true`.
  - `nswf`: boolean (optional) - Whether the post is NSFW. Defaults to `false`.
  - `spoiler`: boolean (optional) - Whether the post is a spoiler. Defaults to `false`.

**Return Value:**

- A promise that resolves to an object containing information about the newly created post. The response has the following structure:

```typescript
{
  "json": {
    "errors": [],
    "data": {
      "things": [
        {
          "kind": "t3",
          "data": // Post object
        }
      ]
    }
  }
}
```

The `Post` object has the same structure as the one from the `getHot.md` function. Please refer to the `getHot.md` documentation for the detailed `Post` type definition.

**Usage Example:**

```typescript
// Example: Submit a self-post
await redditSdk.api.linksAndComments.submit({
  sr: 'test',
  kind: 'self',
  title: 'This is a test post',
  text: 'This is the body of the test post.',
});

// Example: Submit a link post
await redditSdk.api.linksAndComments.submit({
  sr: 'test',
  kind: 'link',
  title: 'Check out this cool link!',
  url: 'https://www.reddit.com',
});
```
