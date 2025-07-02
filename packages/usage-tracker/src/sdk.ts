import { Redis } from '@upstash/redis';
import { UsageTrackerConstructorOptions, Usage } from './types';

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

export class MicrofoxUsageTracker {
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

  async trackLLMUsage(
    packageName: string,
    modelId: string,
    usage: {
      inputTokens: number;
      outputTokens: number;
      cachedInputTokens?: number;
      reasoningTokens?: number;
      promptTokens?: number;
      completionTokens?: number;
      totalTokens: number;
    },
  ) {
    if (
      process.env[
        `${packageName?.replace(/[- ]/g, '_')?.toUpperCase()}_SECRET_TRACKING`
      ] != 'markup'
    ) {
      return;
    }
    const markupPercent =
      process.env[
        `${packageName?.replace(/[- ]/g, '_')?.toUpperCase()}_SECRET_MARKUP_PERCENT`
      ];
    const usageKey = `${this.prefix}:${getDateKey()}:${modelId}`;
    await this.redis.hset(usageKey, {
      [getTimestampKey()]: JSON.stringify({
        ...usage,
        model: modelId,
        package: cleanPackageName(packageName),
        markup: markupPercent ? parseFloat(markupPercent) : undefined,
      }),
    });
  }

  async trackApi1Usage(
    packageName: string,
    key: string,
    usage: {
      requestCount: number;
      requestData?: number;
    },
  ) {
    if (
      process.env[
        `${packageName?.replace(/[- ]/g, '_')?.toUpperCase()}_SECRET_TRACKING`
      ] != 'markup'
    ) {
      return;
    }
    const markupPercent =
      process.env[
        `${packageName?.replace(/[- ]/g, '_')?.toUpperCase()}_SECRET_MARKUP_PERCENT`
      ];
    const usageKey = `${this.prefix}:${getDateKey()}:${key}`;
    await this.redis.hset(usageKey, {
      [getTimestampKey()]: JSON.stringify({
        ...usage,
        requestKey: key,
        package: cleanPackageName(packageName),
        markup: markupPercent ? parseFloat(markupPercent) : undefined,
      }),
    });
  }

  async getUsage(prefixDateKey: string, packageName?: string) {
    const usageKey = `${this.prefix}:${prefixDateKey}`;
    const dayUsageKeys = await this.redis.keys(usageKey);
    const usages: Usage[] = (
      await Promise.all(
        dayUsageKeys.map(async usageKey => {
          const usage = await this.redis.hgetall(usageKey);
          if (!usage) return [];

          const filteredEntries = Object.values(usage)
            .map(entry => {
              try {
                let json = JSON.parse(entry as string);
                if ('model' in json) {
                  json.type = 'llm';
                }
                if ('requestKey' in json) {
                  json.type = 'api_1';
                }
                return json;
              } catch {
                return null;
              }
            })
            .filter(entry => entry != null)
            .filter(entry =>
              packageName
                ? entry.package === cleanPackageName(packageName)
                : true,
            );
          return filteredEntries as Usage[];
        }),
      )
    ).flat();
    return usages;
  }

  async getDailyUsage(packageName?: string) {
    return this.getUsage(`${getDateKey()}:*`, packageName);
  }

  async getMonthlyUsage(packageName?: string) {
    return this.getUsage(`${getDateKeyUntilMonth()}*`, packageName);
  }

  async getYearlyUsage(packageName?: string) {
    return this.getUsage(`${getDateKeyUntilYear()}*`, packageName);
  }
}

export const createMicrofoxUsageTracker = (
  config: UsageTrackerConstructorOptions,
) => {
  return new MicrofoxUsageTracker(config);
};

export const createDefaultMicrofoxUsageTracker = () => {
  if (
    !process.env.MICROFOX_REDIS_URL_TRACKER ||
    !process.env.MICROFOX_REDIS_TOKEN_TRACKER
  ) {
    return;
  }
  if (!process.env.MICROFOX_CLIENT_REQUEST_ID) {
    return;
  }
  return new MicrofoxUsageTracker({});
};
