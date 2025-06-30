## Function: `submitComment`

Part of the `linksAndComments` section. Submits a new comment on a post or another comment.

**Parameters:**

- `params`: object
  - An object containing the comment details.
  - `api_type`: 'json' - Must be the string 'json'.
  - `thing_id`: string - The fullname of the parent thing (a post or another comment) to reply to.
  - `text`: string - The raw markdown text of the comment.
  - `recaptcha_token`: string (optional) - A recaptcha token, if required.
  - `return_rtjson`: boolean (optional) - If true, the response will include the rich text JSON of the comment.
  - `richtext_json`: string (optional) - The comment content as a rich text JSON string.
  - `video_poster_url`: string (optional) - The URL of a video poster image.

**Return Value:**

- A promise that resolves to an object containing information about the newly created comment. The response has the following structure:

```typescript
{
  "json": {
    "errors": [],
    "data": {
      "things": [
        {
          "kind": "t1",
          "data": // Comment object
        }
      ]
    }
  }
}
```

The `Comment` object has the same structure as the one from the `getComments.md` function. Please refer to the `getComments.md` documentation for the detailed `Comment` type definition.

**Usage Example:**

```typescript
// Example: Submit a comment on a post
const postFullname = 't3_postid';
const commentText = 'This is a great post!';

const result = await redditSdk.api.linksAndComments.submitComment({
  api_type: 'json',
  thing_id: postFullname,
  text: commentText,
});

console.log(
  'Comment submitted successfully:',
  result.json.data.things[0].data.id,
);
```
