## Function: `deleteGroupItem`

Deletes an item from a group.

**Purpose:**
Removes an item from a specified group in the YouTube Analytics API.

**Parameters:**

- `id` (string, required): The ID of the group item to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the group item has been deleted.

**Examples:**

```typescript
// Example: Delete a group item
await sdk.deleteGroupItem('<group_item_id>');
```