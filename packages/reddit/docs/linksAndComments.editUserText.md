## Function: `editUserText`

Part of the `linksAndComments` section. Edits the text of a self-post or a comment.

**Parameters:**

- `params`: object
  - An object containing the edit details.
  - `api_type`: 'json' - Must be the string 'json'.
  - `thing_id`: string - The fullname of the thing to edit.
  - `text`: string - The new raw markdown text.
  - `return_rtjson`: boolean (optional) - If true, the response will include the rich text JSON.
  - `richtext_json`: string (optional) - The new content as a rich text JSON string.
  - `video_poster_url`: string (optional) - The URL of a video poster image.

**Return Value:**

- A promise that resolves to an object containing information about the edited thing. The response has the following structure:

```typescript
{
  "json": {
    "errors": [],
    "data": {
      "things": [
        {
          "kind": "t1" | "t3", // "t1" for comment, "t3" for post
          "data": // Comment or Post object
        }
      ]
    }
  }
}
```

The `Comment` object has the same structure as the one from the `getComments.md` function. Please refer to the `getComments.md` documentation for the detailed `Comment` type definition. The `Post` object has the same structure as the one from the `getHot.md` function. Please refer to the `getHot.md` documentation for the detailed `Post` type definition.

**Usage Example:**

```typescript
// Example: Edit a comment
const commentFullname = 't1_commentid';
const newText = 'This is the edited comment text.';

const result = await redditSdk.api.linksAndComments.editUserText({
  api_type: 'json',
  thing_id: commentFullname,
  text: newText,
});

console.log(
  'Comment edited successfully:',
  result.json.data.things[0].data.body,
);
```
