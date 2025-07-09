import { Redis } from '@upstash/redis';

/**
 * Configuration for the rate limiter.
 */
export interface RatelimitConfig {
  /**
   * The number of requests allowed per window.
   */
  requests: number;
  /**
   * The duration of the window in seconds.
   */
  window: number;
  /**
   * An optional prefix for the Redis key.
   * @default 'ratelimit'
   */
  prefix?: string;
}

/**
 * The response from the rate limiter.
 */
export interface RatelimitResponse {
  /**
   * Whether the request is allowed.
   */
  allowed: boolean;
  /**
   * The number of remaining requests in the current window.
   */
  remaining: number;
  /**
   * The timestamp (in seconds since epoch) when the rate limit will reset.
   */
  reset: number;
}

/**
 * A Redis-based rate limiter using a fixed window counter algorithm.
 *
 * This class is useful for tracking and enforcing rate limits for users or API keys.
 *
 * @example
 * ```typescript
 * const redis = new Redis({...});
 * // 10 requests per 60 seconds
 * const ratelimit = new Ratelimit(redis, { requests: 10, window: 60 });
 * const { allowed, remaining } = await ratelimit.limit('user123');
 * if (!allowed) {
 *   // handle rate limited request
 * }
 * ```
 */
export class Ratelimit {
  private redis: Redis;
  private requests: number;
  private window: number;
  private prefix: string;

  /**
   * Creates a new Ratelimit instance.
   * @param redis An instance of `@upstash/redis`.
   * @param config The rate limit configuration.
   */
  constructor(redis: Redis, config: RatelimitConfig) {
    if (!redis) {
      throw new Error('Redis client must be provided.');
    }
    this.redis = redis;
    this.requests = config.requests;
    this.window = config.window;
    this.prefix = config.prefix || 'ratelimit';
  }

  /**
   * Checks if a request from a given identifier is within the rate limit and increments the count.
   * This implementation uses a fixed window counter.
   *
   * @param identifier A unique identifier for the user or API key.
   * @returns A promise that resolves to an object with the rate limit status.
   */
  public async limit(identifier: string): Promise<RatelimitResponse> {
    const now = Math.floor(Date.now() / 1000);
    const currentWindowStart = Math.floor(now / this.window) * this.window;
    const key = `${this.prefix}:${identifier}:${currentWindowStart}`;

    const [count] = await this.redis
      .multi()
      .incr(key)
      .expire(key, this.window)
      .exec<[number, number]>();

    const allowed = count <= this.requests;
    const remaining = allowed ? this.requests - count : 0;
    const reset = currentWindowStart + this.window;

    return {
      allowed,
      remaining,
      reset,
    };
  }
}
