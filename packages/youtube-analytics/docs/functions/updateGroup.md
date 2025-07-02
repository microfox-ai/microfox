## Function: `updateGroup`

Updates an existing group.

**Purpose:**
Modifies an existing group in the YouTube Analytics API.

**Parameters:**

- `group` (Pick<Group, 'id' | 'snippet'>, required): The group resource to update, including the `id` and `snippet` properties.
  - `id` (string, required): The ID of the group to update.
  - `snippet` (object, required): The snippet of the group to update.
    - `title` (string, required): The title of the group.

**Return Value:**

- `Promise<Group>`: A promise that resolves to the updated group object.
  - `kind` (string): Always `"youtube#group"`.
  - `etag` (string): The ETag of the group.
  - `id` (string): The ID of the group.
  - `snippet` (object): Snippet information about the group.
    - `publishedAt` (string): Date and time of creation.
    - `title` (string): Title of the group.
  - `contentDetails` (object): Content details of the group.
    - `itemCount` (number): Number of items in the group.
    - `itemType` (string): Type of items in the group. Possible values: `"youtube#channel"`, `"youtube#playlist"`, `"youtube#video"`, `"youtubePartner#asset"`.

**Examples:**

```typescript
// Example: Update the title of a group
const updatedGroup = await sdk.updateGroup({
  id: '<group_id>',
  snippet: { title: 'Updated Group Title' },
});
```