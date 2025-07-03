## Function: `listGroups`

Lists available groups.

**Purpose:**
This function retrieves a list of groups defined in the YouTube Analytics API.

**Parameters:**

- `params` (GroupListParams, required): An object containing the parameters for the group list request.
  - `id` (string, optional): A comma-separated list of group IDs to retrieve.
  - `mine` (boolean, optional): Set to `true` to retrieve all groups owned by the authenticated user.
  - `onBehalfOfContentOwner` (string, optional): The content owner ID for requests on behalf of a content owner.
  - `pageToken` (string, optional): A pagination token for retrieving the next page of results.

**Return Value:**

- `Promise<GroupListResponse>`: A promise that resolves to the list of groups.
  - `kind` (string): Always `"youtube#groupListResponse"`.
  - `etag` (string): The ETag of the response.
  - `items` (array<Group>): An array of group objects.
    - `kind` (string): Always `"youtube#group"`.
    - `etag` (string): The ETag of the group.
    - `id` (string): The ID of the group.
    - `snippet` (object): Snippet information about the group.
      - `publishedAt` (string): Date and time of creation.
      - `title` (string): Title of the group.
    - `contentDetails` (object): Content details of the group.
      - `itemCount` (number): Number of items in the group.
      - `itemType` (string): Type of items in the group. Possible values: `"youtube#channel"`, `"youtube#playlist"`, `"youtube#video"`, `"youtubePartner#asset"`.
  - `nextPageToken` (string, optional): A pagination token for retrieving the next page of results.

**Examples:**

```typescript
// Example 1: List all groups owned by the user
const groups = await sdk.listGroups({ mine: true });

// Example 2: List groups with specific IDs
const groups = await sdk.listGroups({ id: '<group_id1>,<group_id2>' });
```