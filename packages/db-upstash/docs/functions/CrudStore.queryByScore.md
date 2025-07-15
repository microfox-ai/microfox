---
title: CrudStore.queryByScore()
---

# CrudStore.queryByScore()

Queries for items within a given score range on a specified `sortField`. This is useful for fetching items based on numeric criteria, such as timestamps, prices, or counts.

## Signature

```ts
queryByScore(options: {
  sortField: StoreField;
  min: number;
  max: number;
  offset?: number;
  count?: number;
}): Promise<T[]>
```

## Parameters

- **`options`** (`object`): An object containing the query options.
  - **`sortField`** (`StoreField`): The indexed field to query against.
  - **`min`** (`number`): The minimum score for the range (inclusive).
  - **`max`** (`number`): The maximum score for the range (inclusive).
  - **`offset`** (`number`, optional): The number of items to skip within the matched range. Defaults to `0`.
  - **`count`** (`number`, optional): The maximum number of items to return from the matched range. Defaults to `10`.

## Returns

- `Promise<T[]>`: A promise that resolves to an array of items matching the score range.

## Example

```ts
// Get all posts created in the last 24 hours
const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
const newPosts = await postStore.queryByScore({
  sortField: 'createdAt',
  min: oneDayAgo,
  max: Date.now(),
});

// Find posts with 100 to 500 views
const popularPosts = await postStore.queryByScore({
  sortField: 'viewCount',
  min: 100,
  max: 500,
});
```
