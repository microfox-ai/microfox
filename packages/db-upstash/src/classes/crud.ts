import { Redis } from '@upstash/redis';
import { safeJsonParse, safeJsonStringify } from '../helper/json';

export class DbUpstashError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ConfigurationError extends DbUpstashError {}
export class ItemNotFoundError extends DbUpstashError {}
export class InvalidFieldError extends DbUpstashError {}

/**
 * A generic CRUD helper class for Upstash Redis.
 * It uses a Redis hash for each item, with the key being `${keyPrefix}:${id}`.
 * This allows for atomic updates of individual properties.
 *
 * @remarks
 * **Best Suited For:**
 * This class is ideal for managing objects where you frequently perform partial updates or need atomic operations on individual fields.
 * Examples include:
 * - User profiles: Atomically update a user's last login time or profile information.
 * - Session management: Store and update session data for a user.
 * - Real-time features: Manage presence status, feature flags, or settings for an entity.
 * - Shopping carts: Atomically modify items in a user's cart.
 *
 * **Limitations:**
 * The `query` and `list` methods use `SCAN` to iterate over keys, which can be inefficient for large datasets.
 * For each matching key, a separate `HGETALL` command is executed (though pipelined).
 * This can be slow and resource-intensive if you have a large number of items.
 * For use cases requiring complex queries or efficient retrieval of large lists of items,
 * consider using a different data structure pattern, such as using Redis Search, or maintaining secondary indexes in Redis Sorted Sets.
 */
export class CrudHash<T extends { id: string } & Record<string, any>> {
  private redis: Redis;
  private keyPrefix: string;

  /**
   * Creates an instance of Crud.
   * @param redis - The Redis client from @upstash/redis.
   * @param keyPrefix - A prefix for all keys created by this instance.
   */
  constructor(redis: Redis, keyPrefix: string) {
    if (!redis) {
      throw new ConfigurationError('Redis client must be provided.');
    }
    if (!keyPrefix) {
      throw new ConfigurationError('Key prefix must be provided.');
    }
    this.redis = redis;
    this.keyPrefix = keyPrefix;
  }

  private getKey(id: string): string {
    return `${this.keyPrefix}:${id}`;
  }

  private serialize(obj: Record<string, any>): Record<string, string> {
    const serialized: Record<string, string> = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        serialized[key] = safeJsonStringify(obj[key]);
      }
    }
    return serialized;
  }

  private deserialize<U>(obj: Record<string, any> | null): U | null {
    if (!obj) return null;
    const deserialized: Record<string, any> = {};
    for (const key in obj) {
      deserialized[key] = safeJsonParse(obj[key] as string);
    }
    return deserialized as U;
  }

  /**
   * Sets (creates or overwrites) an item.
   * The item is stored in a hash. This is an atomic operation that replaces the entire item.
   * @param id - The ID of the item.
   * @param value - The item data.
   * @returns The item that was set.
   * @todo Allow passing an existing transaction object to chain operations.
   */
  public async set(id: string, value: T): Promise<T> {
    const key = this.getKey(id);
    const serializedValue = this.serialize(value);

    const tx = this.redis.multi();
    tx.del(key);
    if (Object.keys(serializedValue).length > 0) {
      tx.hset(key, serializedValue);
    }
    await tx.exec();

    return value;
  }

  /**
   * Gets an item by its ID.
   * @param id - The ID of the item.
   * @returns The item, or null if not found.
   */
  public async get(id: string): Promise<T | null> {
    const key = this.getKey(id);
    const value = await this.redis.hgetall(key);
    if (!value || Object.keys(value).length === 0) {
      return null;
    }
    return this.deserialize<T>(value);
  }

  /**
   * Atomically gets specific fields of an item.
   * If the item does not exist, it returns null.
   * If the item exists but none of the requested fields exist, it returns an empty object.
   * @param id - The ID of the item.
   * @param fields - An array of field names to retrieve.
   * @returns A partial item with the requested fields, or null if the item doesn't exist.
   */
  public async getFields<K extends keyof T>(
    id: string,
    fields: K[]
  ): Promise<Partial<T> | null> {
    const key = this.getKey(id);
    if (fields.length === 0) {
      const exists = await this.redis.exists(key);
      return exists ? {} : null;
    }

    const data = await this.redis.hmget<T>(key, ...(fields as string[]));

    if (data === null) {
      return null;
    }

    return this.deserialize<Partial<T>>(data);
  }

  /**
   * Atomically updates properties of an item using HSET.
   * If the item does not exist, an error is thrown.
   * @param id - The ID of the item to update.
   * @param value - The partial data to update.
   * @returns The full updated item.
   * @todo Allow passing an existing transaction object to chain operations.
   */
  public async update(id: string, value: Partial<T>): Promise<T> {
    const key = this.getKey(id);

    if (Object.keys(value).length === 0) {
      return (await this.get(id))!;
    }

    const serializedValue = this.serialize(value);
    const args = Object.entries(serializedValue).flat();

    // This Lua script ensures atomicity. It checks for the key's existence
    // and performs the update in a single, uninterruptible operation.
    // It returns 1 on successful update, and 0 if the key does not exist.
    const luaScript = `
      if redis.call('EXISTS', KEYS[1]) == 0 then
        return 0
      end
      redis.call('HSET', KEYS[1], unpack(ARGV))
      return 1
    `;

    const result = await this.redis.eval(luaScript, [key], args);

    if (result === 0) {
      throw new ItemNotFoundError(`Item with id "${id}" not found.`);
    }

    return (await this.get(id))!;
  }

  /**
   * Lists all items.
   * This is a convenience method for `query('*')`.
   * @returns An array of all items.
   */
  public async list(options?: {
    count?: number;
    offset?: number;
  }): Promise<T[]> {
    return this.query('*', options);
  }

  /**
   * Queries for items using a glob-style pattern on the ID part of the key.
   * Example: `query('user-*')` will find all items where id starts with `user-`.
   * Uses SCAN, so it is safe for production, but can be slow.
   * Supports pagination with `count` and `offset`.
   * @param pattern - A glob-style pattern to match against item IDs.
   * @param options - Pagination options: `count` for page size, `offset` for starting position.
   * @returns An array of items that match the pattern.
   */
  public async query(
    pattern: string,
    options?: { count?: number; offset?: number }
  ): Promise<T[]> {
    const offset = options?.offset ?? 0;
    const count = options?.count;
    const desiredKeyCount = count !== undefined ? offset + count : undefined;

    const allKeys: string[] = [];
    let cursor = 0;
    const matchPattern = `${this.keyPrefix}:${pattern}`;

    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, {
        match: matchPattern,
        // Fetch in batches of 250, or more if the total desired count is very large
        count: desiredKeyCount ? Math.max(250, desiredKeyCount) : 250,
      });
      allKeys.push(...keys);
      cursor = Number(nextCursor);
      // Stop scanning if we have enough keys to satisfy the offset and count
      if (desiredKeyCount && allKeys.length >= desiredKeyCount) {
        break;
      }
    } while (cursor !== 0);

    const paginatedKeys = allKeys.slice(
      offset,
      count !== undefined ? offset + count : undefined
    );

    if (paginatedKeys.length === 0) {
      return [];
    }

    const pipeline = this.redis.pipeline();
    paginatedKeys.forEach((key) => pipeline.hgetall(key));
    const results = await pipeline.exec<Record<string, string>[]>();

    const items: T[] = [];
    for (const result of results) {
      const deserialized = this.deserialize<T>(result);
      if (deserialized) {
        items.push(deserialized);
      }
    }

    return items;
  }

  /**
   * Deletes an item by its ID.
   * @param id - The ID of the item to delete.
   * @todo Allow passing an existing transaction object to chain operations.
   */
  public async del(id: string): Promise<void> {
    const key = this.getKey(id);
    await this.redis.del(key);
  }
}

/**
 * A generic CRUD helper class for Upstash Redis that is optimized for querying
 * and listing large numbers of items efficiently using multiple indexes.
 *
 * @remarks
 * **Data Storage Pattern:**
 * This class uses a combination of Redis Hashes and multiple Sorted Sets to provide
 * efficient querying capabilities.
 * - **Hash:** Each item is stored in a separate Redis Hash. The key for the hash is `{keyPrefix}:item:{id}`.
 * - **Sorted Set:** For each field specified in `sortFields`, a separate Sorted Set is created
 *   to act as an index for range-based queries. The key for these sets is `{keyPrefix}:zset:{sortField}`.
 * - **Set:** For each field specified in `matchFields`, a Redis Set is used to index item IDs
 *   for exact-match queries. The key is `{keyPrefix}:match:{field}:{value}`.
 *
 * **Best Suited For:**
 * This class is ideal for managing collections of objects where you need to
 * efficiently query, sort, and paginate through them using different criteria.
 * Examples include:
 * - A list of blog posts that can be sorted by `createdAt` (sorted) or filtered by `status: 'published'` (matched).
 * - A product catalog sortable by `price` (sorted) and filterable by `category: 'electronics'` (matched).
 *
 * **Atomic Operations:**
 * The `set` and `del` methods use Redis pipelines to ensure that the item hash and all of its
 * indexes are updated in a single batch. For `matchFields`, this involves a read-before-write
 * pattern to ensure indexes are cleaned up correctly, which is highly efficient but not strictly atomic
 * in the case of simultaneous updates to the same item.
 */
export class CrudStore<
  T extends { id: string } & Record<string, any>,
  StoreField extends keyof T & string,
> {
  private redis: Redis;
  private keyPrefix: string;
  private sortFields: StoreField[];
  private matchFields: StoreField[];

  /**
   * Creates an instance of CrudStore.
   * @param redis - The Redis client from @upstash/redis.
   * @param keyPrefix - A prefix for all keys created by this instance.
   * @param config - Configuration for the store's indexes.
   *   - `sortFields`: An array of fields to use for numeric, sorted indexes (for sorting and range queries).
   *   - `matchFields`: An optional array of fields to use for exact-match indexes.
   *   - TODO: `lexiSortFields`: An array of fields for lexicographical (alphabetical) sorting.
   *   - TODO: `compositeIndexes`: An array of field arrays for composite sorting/filtering.
   */
  constructor(
    redis: Redis,
    keyPrefix: string,
    config: {
      sortFields: StoreField[];
      matchFields?: StoreField[];
    }
  ) {
    if (!redis) {
      throw new ConfigurationError('Redis client must be provided.');
    }
    if (!keyPrefix) {
      throw new ConfigurationError('Key prefix must be provided.');
    }
    if (!config || !config.sortFields || config.sortFields.length === 0) {
      throw new ConfigurationError('At least one sort field must be provided.');
    }
    this.redis = redis;
    this.keyPrefix = keyPrefix;
    this.sortFields = config.sortFields;
    this.matchFields = config.matchFields ?? [];
  }

  private getItemKey(id: string): string {
    return `${this.keyPrefix}:item:${id}`;
  }

  private getZSetKey(sortField: StoreField): string {
    return `${this.keyPrefix}:zset:${sortField}`;
  }

  private getMatchKey(field: StoreField, value: string | number): string {
    return `${this.keyPrefix}:match:${field}:${value}`;
  }

  private serialize(obj: Record<string, any>): Record<string, string> {
    const serialized: Record<string, string> = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        serialized[key] = safeJsonStringify(obj[key]);
      }
    }
    return serialized;
  }

  private deserialize<U>(obj: Record<string, any> | null): U | null {
    if (!obj) return null;
    const deserialized: Record<string, any> = {};
    for (const key in obj) {
      deserialized[key] = safeJsonParse(obj[key] as string);
    }
    return deserialized as U;
  }

  /**
   * Sets (creates or overwrites) an item.
   * Atomically updates the item hash and all of its sorted set indexes.
   * @param item - The item to set. Must contain an `id` and all specified `sortFields`.
   * @returns The item that was set.
   * @todo Allow passing an existing transaction object to chain operations.
   */
  public async set(item: T): Promise<T> {
    const oldItem = await this.get(item.id);

    const itemKey = this.getItemKey(item.id);
    const serializedItem = this.serialize(item);

    const tx = this.redis.multi();
    tx.hset(itemKey, serializedItem);

    for (const sortField of this.sortFields) {
      const value = item[sortField];
      let score: number;

      if (value === null || value === undefined) {
        throw new InvalidFieldError(
          `Value for sort field "${sortField}" cannot be null or undefined.`
        );
      }

      if (typeof value === 'string') {
        score = parseFloat(value);
        if (isNaN(score)) {
          throw new InvalidFieldError(
            `Value "${value}" for sort field "${sortField}" is not a parsable number.`
          );
        }
      } else if (typeof value === 'number') {
        score = value;
      } else {
        throw new InvalidFieldError(
          `Value for sort field "${sortField}" must be a number or a string parsable to a number.`
        );
      }

      const zsetKey = this.getZSetKey(sortField);
      tx.zadd(zsetKey, { score, member: item.id });
    }

    // TODO: Add support for lexiSortFields.
    // This would involve adding members to a sorted set with a score of 0.

    // TODO: Add support for composite indexes.

    for (const matchField of this.matchFields) {
      const newValue = item[matchField];
      const oldValue = oldItem?.[matchField];

      if (newValue !== oldValue) {
        if (oldValue !== null && oldValue !== undefined) {
          const oldMatchKey = this.getMatchKey(
            matchField,
            oldValue as string | number
          );
          tx.srem(oldMatchKey, item.id);
        }
        if (newValue !== null && newValue !== undefined) {
          const newMatchKey = this.getMatchKey(
            matchField,
            newValue as string | number
          );
          tx.sadd(newMatchKey, item.id);
        }
      }
    }

    await tx.exec();
    return item;
  }

  /**
   * Gets an item by its ID.
   * @param id - The ID of the item.
   * @returns The item, or null if not found.
   */
  public async get(id: string): Promise<T | null> {
    const key = this.getItemKey(id);
    const value = await this.redis.hgetall(key);
    if (!value) {
      return null;
    }
    return this.deserialize<T>(value);
  }

  /**
   * Deletes an item by its ID.
   * Atomically removes the item hash and its entries from all sorted set indexes.
   * @param id - The ID of the item to delete.
   * @todo Allow passing an existing transaction object to chain operations.
   */
  public async del(id: string): Promise<void> {
    const itemKey = this.getItemKey(id);
    let itemToDelete: Partial<T> | null = null;

    if (this.matchFields.length > 0) {
      const data = await this.redis.hmget<Record<string, any>>(
        itemKey,
        ...(this.matchFields as string[])
      );
      if (data) {
        itemToDelete = this.deserialize<Partial<T>>(data);
      }
    } else {
      // If there are no match fields, we only need to know if the item exists
      // to correctly clean up the sortFields indexes.
      const exists = await this.redis.exists(itemKey);
      if (exists) {
        itemToDelete = { id } as Partial<T>; // A dummy object to signal existence
      }
    }

    if (!itemToDelete) {
      return; // Item does not exist
    }

    const tx = this.redis.multi();
    tx.del(itemKey);

    for (const sortField of this.sortFields) {
      tx.zrem(this.getZSetKey(sortField), id);
    }

    // TODO: Add cleanup for lexiSortFields when implemented.

    // TODO: Add cleanup for composite indexes.

    for (const matchField of this.matchFields) {
      const value = itemToDelete[matchField];
      if (value !== null && value !== undefined) {
        const matchKey = this.getMatchKey(matchField, value as string | number);
        tx.srem(matchKey, id);
      }
    }

    await tx.exec();
  }

  private async fetchItemsByIds(ids: string[]): Promise<T[]> {
    if (ids.length === 0) {
      return [];
    }

    const pipeline = this.redis.pipeline();
    ids.forEach((id) => pipeline.hgetall(this.getItemKey(id)));
    const results = await pipeline.exec<Record<string, string>[]>();

    const items: T[] = [];
    for (const result of results) {
      if (result) {
        const deserialized = this.deserialize<T>(result);
        if (deserialized) {
          items.push(deserialized);
        }
      }
    }
    return items;
  }

  /**
   * Lists items, sorted by the specified index field.
   * Supports pagination and ascending/descending order.
   * @param options - Pagination and sorting options, including the `sortField` to use.
   * @returns A list of items.
   */
  public async list(options: {
    sortField: StoreField;
    offset?: number;
    count?: number;
    desc?: boolean;
  }): Promise<T[]> {
    const { sortField, offset = 0, count = 10, desc = false } = options;
    const start = offset;
    const stop = offset + count - 1;

    const ids = await this.redis.zrange(
      this.getZSetKey(sortField),
      start,
      stop,
      {
        rev: desc,
      }
    );

    return this.fetchItemsByIds(ids as string[]);
  }

  /**
   * Queries for items within a given score range on a specified index.
   * @param options - Score range and pagination options, including the `sortField` to use.
   * @returns A list of items matching the score range.
   */
  public async queryByScore(options: {
    sortField: StoreField;
    min: number;
    max: number;
    offset?: number;
    count?: number;
  }): Promise<T[]> {
    const { sortField, min, max, offset = 0, count = 10 } = options;
    const ids = await this.redis.zrange(this.getZSetKey(sortField), min, max, {
      byScore: true,
      offset,
      count,
    });
    return this.fetchItemsByIds(ids as string[]);
  }

  /**
   * Queries for items where a field has an exact value.
   * The field must be included in the `matchFields` configuration.
   * @param options - The field and value to match.
   * @returns A list of items that match the value.
   */
  public async queryByField(options: {
    field: StoreField;
    value: string | number;
  }): Promise<T[]> {
    const { field, value } = options;
    if (!this.matchFields.includes(field)) {
      throw new ConfigurationError(
        `Field "${String(
          field
        )}" is not configured for matching. Please add it to matchFields in the constructor.`
      );
    }
    const matchKey = this.getMatchKey(field, value);
    const ids = await this.redis.smembers(matchKey);
    return this.fetchItemsByIds(ids);
  }

  /**
   * Queries for items where a field's value is in a given array.
   * The field must be included in the `matchFields` configuration.
   * @param options - The field and array of values to match.
   * @returns A list of items that match any of the values.
   */
  public async queryByFieldIn(options: {
    field: StoreField;
    values: (string | number)[];
  }): Promise<T[]> {
    const { field, values } = options;
    if (!this.matchFields.includes(field)) {
      throw new ConfigurationError(
        `Field "${String(
          field
        )}" is not configured for matching. Please add it to matchFields in the constructor.`
      );
    }

    const matchKeys = values.map((value) => this.getMatchKey(field, value));
    if (matchKeys.length === 0) {
      return [];
    }

    const [firstKey, ...restKeys] = matchKeys;
    const ids = await this.redis.sunion(firstKey, ...restKeys);
    return this.fetchItemsByIds(ids as string[]);
  }

  /**
   * [TODO] Queries for items using lexicographical (alphabetical) sorting on a specified index.
   * This feature is not yet implemented. It would allow for powerful autocomplete-style queries.
   * @param _options - Lexicographical query options.
   * @returns A promise that would resolve to a list of matching items.
   */
  public async queryByLex(_options: any): Promise<T[]> {
    throw new Error('Lexicographical querying is not yet implemented.');
  }

  /**
   * [TODO] Queries for items using a composite index.
   * This feature is not yet implemented.
   * @param _options - Composite query options.
   * @returns A promise that would resolve to a list of matching items.
   */
  public async queryByComposite(_options: any): Promise<T[]> {
    throw new Error('Composite index querying is not yet implemented.');
  }

  private async _scanAndDelete(pattern: string): Promise<number> {
    const allKeys: string[] = [];
    let cursor = 0;
    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, {
        match: pattern,
        count: 500,
      });
      allKeys.push(...keys);
      cursor = Number(nextCursor);
    } while (cursor !== 0);

    if (allKeys.length > 0) {
      await this.redis.del(...allKeys);
    }
    return allKeys.length;
  }

  /**
   * [EXPERIMENTAL] Deletes all existing indexes and rebuilds them from the data in the item hashes.
   * This is a potentially long-running and expensive operation, intended for use in
   * migrations or to repair corrupted indexes. It processes items in batches.
   * @param options - Configuration for the re-indexing process.
   *   - `batchSize`: The number of items to process in each batch. Defaults to 100.
   * @returns An object containing the count of items that were re-indexed.
   */
  public async experimental_reIndex(options?: {
    batchSize?: number;
  }): Promise<{ reIndexedCount: number }> {
    const batchSize = options?.batchSize ?? 100;
    let reIndexedCount = 0;

    // 1. Clear all existing indexes for this store instance
    // TODO: When lexiSortFields are added, their zsets will also need to be cleared here.
    // TODO: When composite indexes are added, they will also need to be cleared here.
    await this._scanAndDelete(`${this.keyPrefix}:zset:*`);
    await this._scanAndDelete(`${this.keyPrefix}:match:*`);

    // 2. Scan for all item hashes
    const allItemKeys: string[] = [];
    let cursor = 0;
    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, {
        match: this.getItemKey('*'),
        count: 500, // This is the SCAN count, not the processing batch size
      });
      allItemKeys.push(...keys);
      cursor = Number(nextCursor);
    } while (cursor !== 0);

    // 3. Process items in batches to rebuild indexes
    for (let i = 0; i < allItemKeys.length; i += batchSize) {
      const batchKeys = allItemKeys.slice(i, i + batchSize);
      if (batchKeys.length === 0) {
        continue;
      }

      const readPipeline = this.redis.pipeline();
      batchKeys.forEach((key) => readPipeline.hgetall(key));
      const results = await readPipeline.exec<Record<string, any>[]>();

      const writePipeline = this.redis.pipeline();
      let commandsAdded = false;
      for (const result of results) {
        if (!result) continue;

        const item = this.deserialize<T>(result);
        if (!item) continue;

        // Re-apply sort field indexes
        for (const sortField of this.sortFields) {
          const value = item[sortField];
          let score: number;

          if (typeof value === 'string') {
            score = parseFloat(value);
            if (isNaN(score)) continue;
          } else if (typeof value === 'number') {
            score = value;
          } else {
            // Skip if value is not a number or a parsable string
            continue;
          }
          const zsetKey = this.getZSetKey(sortField);
          writePipeline.zadd(zsetKey, { score, member: item.id });
          commandsAdded = true;
        }

        // TODO: When lexiSortFields are implemented, they will need to be rebuilt here.

        // TODO: When composite indexes are implemented, they will need to be rebuilt here.

        // Re-apply match field indexes
        for (const matchField of this.matchFields) {
          const value = item[matchField];
          if (value !== null && value !== undefined) {
            const matchKey = this.getMatchKey(
              matchField,
              value as string | number
            );
            writePipeline.sadd(matchKey, item.id);
            commandsAdded = true;
          }
        }
        reIndexedCount++;
      }

      if (commandsAdded) {
        await writePipeline.exec();
      }
    }

    return { reIndexedCount };
  }
}
