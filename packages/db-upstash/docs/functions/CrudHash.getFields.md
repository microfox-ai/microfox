---
title: CrudHash.getFields()
---

# CrudHash.getFields()

Atomically gets one or more specific fields of an item without retrieving the entire object. This is more efficient than `get()` if you only need a subset of the data.

## Signature

```ts
getFields<K extends keyof T>(id: string, fields: K[]): Promise<Partial<T> | null>
```

## Parameters

- **`id`** (`string`): The unique ID of the item.
- **`fields`** (`K[]`): An array of strings representing the field names you want to retrieve.

## Returns

- `Promise<Partial<T> | null>`: A promise that resolves to:
  - A partial item object containing only the requested fields that exist.
  - An empty object `{}` if the item exists but none of the requested fields do.
  - `null` if the item with the specified `id` does not exist.

## Example

```ts
const userId = 'user-123';
const partialUser = await userStore.getFields(userId, ['name', 'lastLogin']);

if (partialUser) {
  console.log(partialUser.name); // 'Jane Doe'
  console.log(partialUser.lastLogin); // 1678886400000
  console.log(partialUser.email); // undefined
}
```
