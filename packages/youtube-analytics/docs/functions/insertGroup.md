## Function: `insertGroup`

Inserts a new group.

**Purpose:**
Creates a new group in the YouTube Analytics API.

**Parameters:**

- `group` (Omit<Group, 'id' | 'etag' | 'kind'>, required): The group resource to create, excluding the `id`, `etag`, and `kind` properties.
  - `snippet` (object, required): The snippet of the group.
    - `title` (string, required): The title of the group.
  - `contentDetails` (object, required): The content details of the group.
    - `itemCount` (number, required): The number of items in the group.
    - `itemType` (string, required): The type of items in the group. Possible values: `"youtube#channel"`, `"youtube#playlist"`, `"youtube#video"`, `"youtubePartner#asset"`.

**Return Value:**

- `Promise<Group>`: A promise that resolves to the created group object.
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
// Example: Create a new group
const newGroup = await sdk.insertGroup({
  snippet: { title: 'My New Group' },
  contentDetails: { itemCount: 10, itemType: 'youtube#video' },
});
```