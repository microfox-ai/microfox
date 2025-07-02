## Function: `deleteGroup`

Deletes a group.

**Purpose:**
Removes a group from the YouTube Analytics API.

**Parameters:**

- `id` (string, required): The ID of the group to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the group has been deleted.

**Examples:**

```typescript
// Example: Delete a group
await sdk.deleteGroup('<group_id>');
```