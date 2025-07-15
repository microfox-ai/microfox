---
title: CrudHash.update()
---

# CrudHash.update()

Atomically updates one or more properties of an existing item. This operation is performed using a Lua script to ensure that the check for the item's existence and the update itself are a single, uninterruptible operation, preventing race conditions.

If the item does not exist, an error is thrown.

## Signature

```ts
update(id: string, value: Partial<T>): Promise<T>
```

## Parameters

- **`id`** (`string`): The unique ID of the item to update.
- **`value`** (`Partial<T>`): An object containing the fields and new values to update.

## Returns

- `Promise<T>`: A promise that resolves to the full, updated item object after the update is complete.

## Throws

- `ItemNotFoundError`: Thrown if the item with the specified `id` does not exist.

## Example

```ts
const userId = 'user-123';
const updates = {
  lastLogin: Date.now(),
  loginAttempts: 5,
};

try {
  const updatedUser = await userStore.update(userId, updates);
  console.log(updatedUser.lastLogin); // The new timestamp
} catch (e) {
  if (e instanceof ItemNotFoundError) {
    console.error('Cannot update user, as they do not exist.');
  }
}
```
