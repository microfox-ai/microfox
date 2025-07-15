---
title: CrudHash.list()
---

# CrudHash.list()

Lists all items in the store. This is a convenience method that is equivalent to calling `query('*')`.

**Note:** This method uses `SCAN` and can be slow and resource-intensive on large datasets. It is intended for smaller collections or administrative purposes.

## Signature

```ts
list(options?: { count?: number; offset?: number }): Promise<T[]>
```

## Parameters

- **`options`** (`object`, optional): An object containing pagination options.
  - **`count`** (`number`, optional): The number of items to return per page.
  - **`offset`** (`number`, optional): The number of items to skip for pagination. Defaults to `0`.

## Returns

- `Promise<T[]>`: A promise that resolves to an array of all items, respecting the pagination options.

## Example

```ts
// Get the first 10 users
const firstTenUsers = await userStore.list({ count: 10 });

// Get the next 10 users
const nextTenUsers = await userStore.list({ count: 10, offset: 10 });
```
