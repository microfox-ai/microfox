import { Usage } from '@microfox/usage-tracker';
import { OpenAIPricingConfig } from './ai-provider-openai';
import { AwsSesPricingConfig } from './aws-ses';
import { BravePricingConfig } from './brave';
import { UsageWithPricing } from '../types';

export const PricingConfig = {
  ...AwsSesPricingConfig,
  ...OpenAIPricingConfig,
  ...BravePricingConfig,
};

export const attachPricingApi1 = (usage: Usage): UsageWithPricing => {
  if (usage.type !== 'api_1' || !usage.requestKey) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    };
  }
  const pricingPkgConfig = (PricingConfig as any)[usage.package];
  if (!pricingPkgConfig) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    };
  }
  const pricingKeyConfig = (pricingPkgConfig as any)[usage.requestKey];
  if (!pricingKeyConfig) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    };
  }
  let usagePriceUSD = 0;
  if (
    usage.type === 'api_1' &&
    usage.requestCount &&
    pricingKeyConfig.requestCount
  ) {
    usagePriceUSD +=
      pricingKeyConfig.requestCount.basePriceUSD *
      (usage.requestCount / pricingKeyConfig.requestCount.per);
  }
  if (
    usage.type === 'api_1' &&
    usage.requestData &&
    pricingKeyConfig.requestData
  ) {
    usagePriceUSD +=
      pricingKeyConfig.requestData.basePriceUSD *
      (usage.requestData / pricingKeyConfig.requestData.per);
  }
  return {
    ...usage,
    priceUSD: usagePriceUSD * (1 - (usage.markup ?? 0) / 100),
    originalPriceUSD: usagePriceUSD,
  } as UsageWithPricing;
};

export const attachPricingLLM = (usage: Usage): UsageWithPricing => {
  const pricingConfig = (PricingConfig as any)[usage.package];
  if (!pricingConfig) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    };
  }
  let usagePriceUSD = 0;
  if (usage.type != 'llm' || !usage.model) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    };
  }
  let modelPricingConfig = (pricingConfig as any)[usage.model];
  if (!modelPricingConfig) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    };
  }
  usagePriceUSD +=
    modelPricingConfig.promptToken.basePriceUSD *
    (usage.promptTokens / modelPricingConfig.promptToken.per);
  usagePriceUSD +=
    modelPricingConfig.completionToken.basePriceUSD *
    (usage.completionTokens / modelPricingConfig.completionToken.per);
  return {
    ...usage,
    priceUSD: usagePriceUSD * (1 - (usage.markup ?? 0) / 100),
    originalPriceUSD: usagePriceUSD,
  };
};

export const attachPricing = (usage: Usage): UsageWithPricing => {
  if (usage.type === 'llm') {
    return attachPricingLLM(usage);
  }
  if (usage.type === 'api_1') {
    return attachPricingApi1(usage);
  }
  return usage;
};
