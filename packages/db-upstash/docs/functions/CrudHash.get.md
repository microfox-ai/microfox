---
title: CrudHash.get()
---

# CrudHash.get()

Gets a single item from the store by its ID.

## Signature

```ts
get(id: string): Promise<T | null>
```

## Parameters

- **`id`** (`string`): The unique ID of the item to retrieve.

## Returns

- `Promise<T | null>`: A promise that resolves to the item object if found, or `null` if the item does not exist.

## Example

```ts
const userId = 'user-123';
const user = await userStore.get(userId);

if (user) {
  console.log(user.name); // 'Jane Doe'
} else {
  console.log('User not found.');
}
```
