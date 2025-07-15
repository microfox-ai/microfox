---
title: CrudHash.query()
---

# CrudHash.query()

Queries for items using a glob-style pattern on the ID part of the Redis key. This method uses the `SCAN` command, making it safe for production use without blocking the server, but it can be slow on very large datasets.

The implementation is memory-efficient and will not load an unbounded number of keys into memory.

## Signature

```ts
query(pattern: string, options?: { count?: number; offset?: number }): Promise<T[]>
```

## Parameters

- **`pattern`** (`string`): A glob-style pattern to match against item IDs. For example, `user-*` would find all items where the ID starts with `user-`.
- **`options`** (`object`, optional): An object containing pagination options.
  - **`count`** (`number`, optional): The number of items to return.
  - **`offset`** (`number`, optional): The number of items to skip. Defaults to `0`.

## Returns

- `Promise<T[]>`: A promise that resolves to an array of items that match the pattern, respecting the pagination options.

## Example

```ts
// Find all users who are members of 'org-abc'
const orgUsers = await userStore.query('org-abc:*');

// Find the first 5 users with a 'guest-' prefix
const guestUsers = await userStore.query('guest-*', { count: 5 });
```
