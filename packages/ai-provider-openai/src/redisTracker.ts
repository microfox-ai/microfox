import { Redis } from '@upstash/redis';

const getDateKey = () => {
  return new Date().toISOString().split('T')[0];
};

const getTimestampKey = () => {
  return new Date().toISOString();
};

export const updateUsage = async (
  key: string,
  usage: {
    promptTokens: number;
    completionTokens: number;
  },
) => {
  if (
    !process.env.MICROFOX_REDIS_URL_TRACKER ||
    !process.env.MICROFOX_REDIS_TOKEN_TRACKER
  ) {
    return;
  }
  if (!process.env.MICROFOX_CLIENT_REQUEST_ID) {
    return;
  }

  const redis = new Redis({
    url: process.env.MICROFOX_REDIS_URL_TRACKER,
    token: process.env.MICROFOX_REDIS_TOKEN_TRACKER,
  });

  const prefix =
    process.env.MICROFOX_CLIENT_REQUEST_ID ??
    process.env.MICROFOX_BOT_PROJECT_ID;
  const usageKey = `${prefix}:${getDateKey()}:${key}`;

  await redis.hset(usageKey, {
    [getTimestampKey()]: JSON.stringify({
      ...usage,
      model: key,
      package: 'ai-provider-openai',
    }),
  });
};
