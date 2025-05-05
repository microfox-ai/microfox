## Function: `deleteSCIMUser`

Deletes a SCIM user in Notion (Enterprise plan required).

**Purpose:**
Deprovisions a user via SCIM.

**Parameters:**

- `userId`: string (required). The ID of the SCIM user to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the user has been deleted.

**Examples:**

```typescript
// Example: Deleting a SCIM user
await notion.deleteSCIMUser("some-user-id");
```