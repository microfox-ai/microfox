---
title: CrudStore()
---

# CrudStore Constructor

Initializes a new instance of the `CrudStore` class, a generic CRUD helper for Upstash Redis that is optimized for querying and listing large numbers of items efficiently using multiple types of indexes.

This class is ideal for managing collections of objects where you need to efficiently query, sort, and paginate using different criteria, such as a list of blog posts that can be sorted by `createdAt` (a sorted index) or filtered by `status: 'published'` (a matched index).

## Signature

```ts
constructor(
  redis: Redis,
  keyPrefix: string,
  config: {
    sortFields: StoreField[];
    matchFields?: StoreField[];
  }
)
```

## Parameters

- **`redis`** (`Redis`): An instance of the Redis client from `@upstash/redis`.
- **`keyPrefix`** (`string`): A string prefix for all keys created by this instance (e.g., `posts`).
- **`config`** (`object`): An object to configure the store's indexes.
  - **`sortFields`** (`StoreField[]`): An array of field names to use for numeric, sorted indexes. These are ideal for sorting and range queries (e.g., by timestamp, price, or score). The value of these fields must be a number or a string that can be parsed into a number.
  - **`matchFields`** (`StoreField[]`, optional): An array of field names to use for exact-match indexes. These are ideal for filtering results by a specific value (e.g., by status, category, or tag).

## Throws

- `ConfigurationError`: Thrown if the `redis` client, `keyPrefix`, or `config.sortFields` are not provided.

## Example

```ts
import { Redis } from '@upstash/redis';
import { CrudStore } from '@pkg/db-upstash';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const postStore = new CrudStore(redis, 'posts', {
  sortFields: ['createdAt', 'viewCount'],
  matchFields: ['status', 'authorId'],
});

// Now you can use postStore to manage and query blog posts
```
