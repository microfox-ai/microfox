---
title: CrudStore.experimental_reIndex()
---

# CrudStore.experimental_reIndex()

**[EXPERIMENTAL]**

Deletes all existing `sortField` and `matchField` indexes for the store and rebuilds them from the source-of-truth data in the item hashes.

This is a potentially long-running and expensive operation that should be used with caution, primarily for maintenance, migrations, or to repair corrupted indexes. It processes all items in batches to avoid overwhelming the server.

## Signature

```ts
experimental_reIndex(options?: {
  batchSize?: number;
}): Promise<{ reIndexedCount: number }>
```

## Parameters

- **`options`** (`object`, optional): Configuration for the re-indexing process.
  - **`batchSize`** (`number`, optional): The number of items to process in each batch. Defaults to `100`.

## Returns

- `Promise<{ reIndexedCount: number }>`: A promise that resolves to an object containing the total count of items that were successfully re-indexed.

## Example

```ts
// Rebuild all indexes for the postStore
// This is a major operation and should be run from a maintenance script.
const result = await postStore.experimental_reIndex({ batchSize: 200 });

console.log(`Successfully re-indexed ${result.reIndexedCount} posts.`);
```
