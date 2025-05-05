## Function: `updateSCIMGroup`

Updates a SCIM group in Notion (Enterprise plan required).

**Purpose:**
Modifies an existing group via SCIM.

**Parameters:**

- `groupId`: string (required). The ID of the SCIM group to update.
- `groupData`: Partial<SCIMGroup> (required).
  - `displayName`: string. Display name of the SCIM group.
  - `members`: array<object> | undefined. Members of the SCIM group.
    - `value`: string.
    - `display`: string.

**Return Value:**

- `Promise<SCIMGroup>`: A promise that resolves to the updated SCIMGroup object.
  - `id`: string. Unique identifier for the SCIM group.
  - `displayName`: string. Display name of the SCIM group.
  - `members`: array<object> | undefined. Members of the SCIM group.
    - `value`: string.
    - `display`: string.

**Examples:**

```typescript
// Example: Updating a SCIM group
const updatedGroup = await notion.updateSCIMGroup("some-group-id", { displayName: "Updated Group Name" });
console.log(updatedGroup);
```