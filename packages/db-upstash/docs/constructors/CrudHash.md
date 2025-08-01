---
title: CrudHash()
---

# CrudHash Constructor

Initializes a new instance of the `CrudHash` class, a generic CRUD helper for Upstash Redis that uses a Redis hash for each item.

This class is ideal for managing individual objects where atomic updates on specific fields are common, such as user profiles, session data, or feature flags.

## Signature

```ts
constructor(redis: Redis, keyPrefix: string)
```

## Parameters

- **`redis`** (`Redis`): An instance of the Redis client from `@upstash/redis`. This client is used to execute all commands against your Redis database.
- **`keyPrefix`** (`string`): A string prefix for all keys created by this instance (e.g., `user`). This helps to namespace your data within Redis.

## Throws

- `ConfigurationError`: Thrown if the `redis` client or `keyPrefix` is not provided.

## Example

```ts
import { Redis } from '@upstash/redis';
import { CrudHash } from '@pkg/db-upstash';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const userStore = new CrudHash(redis, 'users');

// Now you can use userStore to manage user data
```
