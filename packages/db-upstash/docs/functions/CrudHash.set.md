---
title: CrudHash.set()
---

# CrudHash.set()

Sets (creates or overwrites) an item in the store. The item is stored in a Redis Hash. This is an atomic operation that replaces the entire hash.

## Signature

```ts
set(id: string, value: T): Promise<T>
```

## Parameters

- **`id`** (`string`): The unique ID of the item. This will be part of the Redis key.
- **`value`** (`T`): The item data to store. It must be an object containing at least an `id` property.

## Returns

- `Promise<T>`: A promise that resolves to the item that was set.

## Example

```ts
const user = {
  id: 'user-123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  lastLogin: Date.now(),
};

await userStore.set(user.id, user);
// The user object is now stored in a hash at key `users:user-123`
```
