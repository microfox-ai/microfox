---
title: CrudStore.queryByFieldIn()
---

# CrudStore.queryByFieldIn()

Queries for items where a field's value matches any of the values in a given array. This is the equivalent of a SQL `IN` clause and is highly efficient, using the `SUNION` command in Redis.

The field must be included in the `matchFields` array in the constructor configuration.

## Signature

```ts
queryByFieldIn(options: {
  field: StoreField;
  values: (string | number)[];
}): Promise<T[]>
```

## Parameters

- **`options`** (`object`): The query options.
  - **`field`** (`StoreField`): The field to query against.
  - **`values`** (`(string | number)[]`): An array of possible values to match.

## Returns

- `Promise<T[]>`: A promise that resolves to an array of items that match any of the provided values.

## Throws

- `ConfigurationError`: Thrown if the specified `field` was not registered in the `matchFields` config.

## Example

```ts
// Get all posts that are either 'archived' or 'flagged'
const postsToReview = await postStore.queryByFieldIn({
  field: 'status',
  values: ['archived', 'flagged'],
});
```
