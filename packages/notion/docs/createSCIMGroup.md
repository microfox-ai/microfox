## Function: `createSCIMGroup`

Creates a SCIM group in Notion (Enterprise plan required).

**Purpose:**
Creates a new group via SCIM.

**Parameters:**

- `groupData`: Partial<SCIMGroup> (required).
  - `displayName`: string. Display name of the SCIM group.
  - `members`: array<object> | undefined. Members of the SCIM group.
    - `value`: string.
    - `display`: string.

**Return Value:**

- `Promise<SCIMGroup>`: A promise that resolves to the created SCIMGroup object.
  - `id`: string. Unique identifier for the SCIM group.
  - `displayName`: string. Display name of the SCIM group.
  - `members`: array<object> | undefined. Members of the SCIM group.
    - `value`: string.
    - `display`: string.

**Examples:**

```typescript
// Example: Creating a SCIM group
const newGroup = await notion.createSCIMGroup({ displayName: "New Group", members: [{ value: "user-id-1", display: "User 1" }] });
console.log(newGroup);
```