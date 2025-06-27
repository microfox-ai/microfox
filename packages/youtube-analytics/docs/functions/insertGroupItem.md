## Function: `insertGroupItem`

Inserts a new item into a group.

**Purpose:**
Adds a new item to a specified group in the YouTube Analytics API.

**Parameters:**

- `groupItem` (Omit<GroupItem, 'id' | 'etag' | 'kind'>, required): The group item resource to create, excluding the `id`, `etag`, and `kind` properties.
  - `groupId` (string, required): The ID of the group to add the item to.
  - `resource` (object, required): The resource representation of the group item.
    - `kind` (string, required): The kind of resource. Possible values: `"youtube#channel"`, `"youtube#playlist"`, `"youtube#video"`, `"youtubePartner#asset"`.
    - `id` (string, required): The ID of the resource.

**Return Value:**

- `Promise<GroupItem>`: A promise that resolves to the created group item object.
  - `kind` (string): Always `"youtube#groupItem"`.
  - `etag` (string): The ETag of the group item.
  - `id` (string): The ID of the group item.
  - `groupId` (string): The ID of the group that the item belongs to.
  - `resource` (object): The resource representation of the group item.
    - `kind` (string): The kind of resource. Possible values: `"youtube#channel"`, `"youtube#playlist"`, `"youtube#video"`, `"youtubePartner#asset"`.
    - `id` (string): The ID of the resource.

**Examples:**

```typescript
// Example: Add a video to a group
const newGroupItem = await sdk.insertGroupItem({
  groupId: '<group_id>',
  resource: { kind: 'youtube#video', id: '<video_id>' },
});
```