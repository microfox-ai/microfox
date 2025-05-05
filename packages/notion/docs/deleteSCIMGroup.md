## Function: `deleteSCIMGroup`

Deletes a SCIM group in Notion (Enterprise plan required).

**Purpose:**
Deletes a group via SCIM.

**Parameters:**

- `groupId`: string (required). The ID of the SCIM group to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the group has been deleted.

**Examples:**

```typescript
// Example: Deleting a SCIM group
await notion.deleteSCIMGroup("some-group-id");
```