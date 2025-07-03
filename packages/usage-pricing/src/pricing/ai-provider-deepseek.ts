import { AIPricingConfig } from '../types';

const commonPricingInputCacheHit = {
  dataUnit: 'token',
  per: 1_000_000,
  description: 'Per 1 million input tokens (cache hit)',
};

const commonPricingInputCacheMiss = {
  dataUnit: 'token',
  per: 1_000_000,
  description: 'Per 1 million input tokens (cache miss)',
};

const commonPricingOutput = {
  dataUnit: 'token',
  per: 1_000_000,
  description: 'Per 1 million output tokens',
};

export const DeepSeekAIPricingConfig = {
  ['ai-provider-deepseek']: {
    type: 'llm',
    // DeepSeek Chat Models
    ['deepseek-chat']: {
      promptToken: {
        basePriceUSD: 0.07,
        ...commonPricingInputCacheHit,
      },
      promptTokenCacheMiss: {
        basePriceUSD: 0.27,
        ...commonPricingInputCacheMiss,
      },
      completionToken: {
        basePriceUSD: 1.1,
        ...commonPricingOutput,
      },
      discountHours: {
        start: '16:30', // UTC
        end: '00:30', // UTC
      },
      discountRates: {
        promptToken: 0.5, // 50% off
        promptTokenCacheMiss: 0.5, // 50% off
        completionToken: 0.5, // 50% off
      },
      features: {
        jsonOutput: true,
        functionCalling: true,
        chatPrefixCompletion: true,
        fimCompletion: true,
      },
    },
    // DeepSeek Reasoner Models
    ['deepseek-reasoner']: {
      promptToken: {
        basePriceUSD: 0.14,
        ...commonPricingInputCacheHit,
      },
      promptTokenCacheMiss: {
        basePriceUSD: 0.55,
        ...commonPricingInputCacheMiss,
      },
      completionToken: {
        basePriceUSD: 2.19,
        ...commonPricingOutput,
      },
      discountHours: {
        start: '16:30', // UTC
        end: '00:30', // UTC
      },
      discountRates: {
        promptToken: 0.75, // 75% off
        promptTokenCacheMiss: 0.75, // 75% off
        completionToken: 0.75, // 75% off
      },
      features: {
        jsonOutput: true,
        functionCalling: true,
        chatPrefixCompletion: true,
        fimCompletion: false,
      },
    },
  },
};
