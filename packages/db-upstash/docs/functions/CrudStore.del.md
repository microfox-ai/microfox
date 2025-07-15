---
title: CrudStore.del()
---

# CrudStore.del()

Deletes an item by its ID. This method atomically removes the item's hash and its entries from all configured `sortFields` and `matchFields` indexes.

This operation is idempotent and will not throw an error if the item does not exist.

## Signature

```ts
del(id: string): Promise<void>
```

## Parameters

- **`id`** (`string`): The unique ID of the item to delete.

## Returns

- `Promise<void>`: A promise that resolves when the delete operation is complete.

## Example

```ts
const postIdToDelete = 'post-001';

await postStore.del(postIdToDelete);
// The hash for 'post-001' is deleted, and its ID is removed from all relevant indexes.
```
