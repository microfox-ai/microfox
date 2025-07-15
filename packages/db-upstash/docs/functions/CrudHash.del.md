---
title: CrudHash.del()
---

# CrudHash.del()

Deletes an item from the store by its ID. This operation is idempotent; it will not throw an error if the item does not exist.

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
const userIdToDelete = 'user-456';

await userStore.del(userIdToDelete);
// The hash at key `users:user-456` is now deleted.
```
