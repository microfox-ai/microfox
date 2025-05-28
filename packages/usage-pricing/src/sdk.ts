import { Redis } from '@upstash/redis';
import { UsageTrackerConstructorOptions, Usage } from '@microfox/usage-tracker';
import { attachPricing } from './pricing/pricing';

// return YYYY-MM-DD
const getDateKey = () => {
  return new Date().toISOString().split('T')[0];
};

// return YYYY-MM
const getDateKeyUntilMonth = () => {
  const date = new Date();
  return date.toISOString().split('T')[0].split('-').slice(0, 2).join('-');
};

// return YYYY
const getDateKeyUntilYear = () => {
  const date = new Date();
  return date.toISOString().split('T')[0].split('-')[0];
};

const getTimestampKey = () => {
  return new Date().toISOString();
};

const cleanPackageName = (packageName: string) => {
  return packageName
    .replace('@microfox/', '')
    .replace('#', '/')
    .replace('@ext_', '');
};

export class MicrofoxUsagePricing {
  private readonly redis: Redis;
  private readonly prefix?: string;

  constructor(config: UsageTrackerConstructorOptions) {
    this.redis = new Redis({
      url: config.redisOptions?.url ?? process.env.MICROFOX_REDIS_URL_TRACKER,
      token:
        config.redisOptions?.token ?? process.env.MICROFOX_REDIS_TOKEN_TRACKER,
    });
    this.prefix =
      config.prefix ??
      process.env.MICROFOX_CLIENT_REQUEST_ID ??
      process.env.MICROFOX_BOT_PROJECT_ID;
  }

  private processUsageEntries(
    usage: Record<string, unknown>,
    packageName?: string,
  ): Usage[] {
    return Object.values(usage)
      .map(entry => {
        try {
          let json = typeof entry === 'string' ? JSON.parse(entry) : entry;
          if ('model' in json) {
            json.type = 'llm';
          }
          if ('requestKey' in json) {
            json.type = 'api_1';
          }
          console.log('json', json);
          return json;
        } catch {
          console.error('Failed to parse usage entry', entry);
          return null;
        }
      })
      .filter(entry => entry != null)
      .filter(entry =>
        packageName ? entry.package === cleanPackageName(packageName) : true,
      ) as Usage[];
  }

  async getUsage(
    packageName?: string,
    prefixDateKey?: string,
    options?: {
      limit?: number;
      offset?: number;
    },
  ) {
    const usageKey = `${this.prefix}:${prefixDateKey ?? '*'}`;
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;

    let cursor = '0';
    const keys: string[] = [];
    let totalItems = 0;

    do {
      const [nextCursor, matchedKeys] = await this.redis.scan(cursor, {
        match: usageKey,
        count: limit,
      });
      cursor = nextCursor;
      keys.push(...matchedKeys);
      totalItems += matchedKeys.length;
    } while (cursor !== '0' && keys.length < offset + limit);

    const pageKeys = keys.slice(offset, offset + limit);

    const usages: Usage[] = (
      await Promise.all(
        pageKeys.map(async usageKey => {
          const usage = await this.redis.hgetall(usageKey);
          if (!usage) return [];
          return this.processUsageEntries(usage, packageName);
        }),
      )
    ).flat();

    return {
      data: usages.map(attachPricing),
      total: totalItems,
      limit,
      offset,
      hasMore: totalItems > offset + limit,
    };
  }

  async getDailyUsage(
    packageName?: string,
    options?: { limit?: number; offset?: number },
  ) {
    return this.getUsage(packageName, `${getDateKey()}:*`, options);
  }

  async getMonthlyUsage(
    packageName?: string,
    options?: { limit?: number; offset?: number },
  ) {
    return this.getUsage(packageName, `${getDateKeyUntilMonth()}*`, options);
  }

  async getYearlyUsage(
    packageName?: string,
    options?: { limit?: number; offset?: number },
  ) {
    return this.getUsage(packageName, `${getDateKeyUntilYear()}*`, options);
  }

  async getFullUsage(packageName?: string, prefixDateKey?: string) {
    const usageKey = `${this.prefix}:${prefixDateKey ?? '*'}`;
    const keys = await this.redis.keys(usageKey);

    const usages: Usage[] = (
      await Promise.all(
        keys.map(async usageKey => {
          const usage = await this.redis.hgetall(usageKey);
          if (!usage) return [];
          return this.processUsageEntries(usage, packageName);
        }),
      )
    ).flat();

    return usages.map(attachPricing);
  }

  async getFullDailyUsage(packageName?: string) {
    return this.getFullUsage(packageName, `${getDateKey()}:*`);
  }

  async getFullMonthlyUsage(packageName?: string) {
    return this.getFullUsage(packageName, `${getDateKeyUntilMonth()}*`);
  }

  async getFullYearlyUsage(packageName?: string) {
    return this.getFullUsage(packageName, `${getDateKeyUntilYear()}*`);
  }
}

export const createMicrofoxUsagePricing = (
  config: UsageTrackerConstructorOptions,
) => {
  return new MicrofoxUsagePricing(config);
};

export const createDefaultMicrofoxUsagePricing = () => {
  if (
    !process.env.MICROFOX_REDIS_URL_TRACKER ||
    !process.env.MICROFOX_REDIS_TOKEN_TRACKER
  ) {
    return;
  }
  if (!process.env.MICROFOX_CLIENT_REQUEST_ID) {
    return;
  }
  return new MicrofoxUsagePricing({});
};
