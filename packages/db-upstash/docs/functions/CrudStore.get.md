---
title: CrudStore.get()
---

# CrudStore.get()

Gets a single item from the store by its ID. This method fetches the item directly from its hash and does not interact with the indexes.

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
const postId = 'post-001';
const post = await postStore.get(postId);

if (post) {
  console.log(post.title); // 'Hello World'
} else {
  console.log('Post not found.');
}
```
