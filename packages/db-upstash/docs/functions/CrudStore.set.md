---
title: CrudStore.set()
---

# CrudStore.set()

Sets (creates or overwrites) an item in the store. This method atomically updates the item's hash and all of its configured indexes (`sortFields` and `matchFields`) in a single batched operation.

For `matchFields`, this involves reading the old item state first to ensure indexes are cleaned up correctly.

## Signature

```ts
set(item: T): Promise<T>
```

## Parameters

- **`item`** (`T`): The item data to store. It must contain an `id` and all fields specified in the `sortFields` and `matchFields` configuration.

## Returns

- `Promise<T>`: A promise that resolves to the item that was set.

## Throws

- `InvalidFieldError`: Thrown if a `sortField` has a value that is null, undefined, or not a parsable number.

## Example

```ts
const newPost = {
  id: 'post-001',
  title: 'Hello World',
  content: '...',
  status: 'published',
  authorId: 'user-123',
  createdAt: Date.now(),
  viewCount: 0,
};

await postStore.set(newPost);
// The post is now stored and indexed by createdAt, viewCount, status, and authorId.
```
