---
title: CrudStore.list()
---

# CrudStore.list()

Lists items from the store, sorted by a specified `sortField`. This method is highly efficient for paginating through ordered data.

## Signature

```ts
list(options: {
  sortField: StoreField;
  offset?: number;
  count?: number;
  desc?: boolean;
}): Promise<T[]>
```

## Parameters

- **`options`** (`object`): An object containing sorting and pagination options.
  - **`sortField`** (`StoreField`): The name of the field to sort by. This field must have been included in the `sortFields` array in the constructor.
  - **`offset`** (`number`, optional): The number of items to skip for pagination. Defaults to `0`.
  - **`count`** (`number`, optional): The number of items to return. Defaults to `10`.
  - **`desc`** (`boolean`, optional): If `true`, the items will be sorted in descending order. Defaults to `false` (ascending).

## Returns

- `Promise<T[]>`: A promise that resolves to a sorted and paginated array of items.

## Example

```ts
// Get the 10 most recent posts
const recentPosts = await postStore.list({
  sortField: 'createdAt',
  desc: true,
  count: 10,
});

// Get the 10 most popular posts
const popularPosts = await postStore.list({
  sortField: 'viewCount',
  desc: true,
  count: 10,
});
```
