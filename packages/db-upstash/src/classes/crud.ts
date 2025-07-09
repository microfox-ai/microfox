import { Redis } from '@upstash/redis';
import { safeJsonParse, safeJsonStringify } from '../helper/json';

/**
 * A generic CRUD helper class for Upstash Redis.
 * It uses a Redis hash for each item, with the key being `${keyPrefix}:${id}`.
 * This allows for atomic updates of individual properties.
 */
export class Crud<T extends { id: string } & Record<string, any>> {
  private redis: Redis;
  private keyPrefix: string;

  /**
   * Creates an instance of Crud.
   * @param redis - The Redis client from @upstash/redis.
   * @param keyPrefix - A prefix for all keys created by this instance.
   */
  constructor(redis: Redis, keyPrefix: string) {
    if (!redis) {
      throw new Error('Redis client must be provided.');
    }
    if (!keyPrefix) {
      throw new Error('Key prefix must be provided.');
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
   * Atomically updates properties of an item using HSET.
   * If the item does not exist, an error is thrown.
   * @param id - The ID of the item to update.
   * @param value - The partial data to update.
   * @returns The full updated item.
   */
  public async update(id: string, value: Partial<T>): Promise<T> {
    const key = this.getKey(id);

    const exists = await this.redis.exists(key);
    if (!exists) {
      throw new Error(`Item with id "${id}" not found.`);
    }

    if (Object.keys(value).length === 0) {
      return (await this.get(id))!;
    }

    const serializedValue = this.serialize(value);
    await this.redis.hset(key, serializedValue);

    return (await this.get(id))!;
  }

  /**
   * Lists all items.
   * This is a convenience method for `query('*')`.
   * @returns An array of all items.
   */
  public async list(): Promise<T[]> {
    return this.query('*');
  }

  /**
   * Queries for items using a glob-style pattern on the ID part of the key.
   * Example: `query('user-*')` will find all items where id starts with `user-`.
   * Uses SCAN, so it is safe for production, but can be slow.
   * @param pattern - A glob-style pattern to match against item IDs.
   * @returns An array of items that match the pattern.
   */
  public async query(pattern: string): Promise<T[]> {
    const items: T[] = [];
    let cursor = 0;
    const matchPattern = `${this.keyPrefix}:${pattern}`;

    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, {
        match: matchPattern,
      });

      if (keys.length > 0) {
        const pipeline = this.redis.pipeline();
        keys.forEach((key) => pipeline.hgetall(key));
        const results = await pipeline.exec<Record<string, string>[]>();

        for (const result of results) {
          const deserialized = this.deserialize<T>(result);
          if (deserialized) {
            items.push(deserialized);
          }
        }
      }

      cursor = Number(nextCursor);
    } while (cursor !== 0);

    return items;
  }

  /**
   * Deletes an item by its ID.
   * @param id - The ID of the item to delete.
   */
  public async del(id: string): Promise<void> {
    const key = this.getKey(id);
    await this.redis.del(key);
  }
}
