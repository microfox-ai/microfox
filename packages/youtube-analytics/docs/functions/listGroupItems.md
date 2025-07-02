## Function: `listGroupItems`

Lists items within a group.

**Purpose:**
Retrieves a list of items belonging to a specific group in the YouTube Analytics API.

**Parameters:**

- `params` (GroupItemListParams, required): An object containing the parameters for the group items list request.
  - `groupId` (string, required): The ID of the group whose items are to be retrieved.
  - `onBehalfOfContentOwner` (string, optional): The content owner ID for requests on behalf of a content owner.

**Return Value:**

- `Promise<GroupItemListResponse>`: A promise that resolves to the list of group items.
  - `kind` (string): Always `"youtube#groupItemListResponse"`.
  - `etag` (string): The ETag of the response.
  - `items` (array<GroupItem>): An array of group item objects.
    - `kind` (string): Always `"youtube#groupItem"`.
    - `etag` (string): The ETag of the group item.
    - `id` (string): The ID of the group item.
    - `groupId` (string): The ID of the group that the item belongs to.
    - `resource` (object): The resource representation of the group item.
      - `kind` (string): The kind of resource. Possible values: `"youtube#channel"`, `"youtube#playlist"`, `"youtube#video"`, `"youtubePartner#asset"`.
      - `id` (string): The ID of the resource.

**Examples:**

```typescript
// Example: List items in a group
const groupItems = await sdk.listGroupItems({ groupId: '<group_id>' });
```