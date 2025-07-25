---
title: CrudStore.queryByField()
---

# CrudStore.queryByField()

Queries for items where a field has an exact value. This provides an efficient way to filter a collection by a specific property, like a status or a category.

The field must be included in the `matchFields` array in the constructor configuration.

## Signature

```ts
queryByField(options: {
  field: StoreField;
  value: string | number;
}): Promise<T[]>
```

## Parameters

- **`options`** (`object`): The query options.
  - **`field`** (`StoreField`): The field to query against.
  - **`value`** (`string | number`): The exact value to match.

## Returns

- `Promise<T[]>`: A promise that resolves to an array of items that match the value.

## Throws

- `ConfigurationError`: Thrown if the specified `field` was not registered in the `matchFields` config.

## Example

```ts
// Get all posts that are in 'draft' status
const draftPosts = await postStore.queryByField({
  field: 'status',
  value: 'draft',
});

// Get all posts by a specific author
const authorPosts = await postStore.queryByField({
  field: 'authorId',
  value: 'user-xyz-789',
});
```
