import { Usage } from '@microfox/usage-tracker';
import { OpenAIPricingConfig } from './ai-provider-openai';
import { AwsSesPricingConfig } from './aws-ses';
import { BravePricingConfig } from './brave';

export const PricingConfig = {
  ...AwsSesPricingConfig,
  ...OpenAIPricingConfig,
  ...BravePricingConfig,
};

export const attachPricingApi1 = (usage: Usage) => {
  const pricingConfig = (PricingConfig as any)[usage.package];
  if (!pricingConfig) {
    return {
      ...usage,
      priceUSD: 0,
    } as Usage;
  }
  let usagePriceUSD = 0;
  if (
    usage.type === 'api_1' &&
    usage.requestCount &&
    pricingConfig.requestCount
  ) {
    usagePriceUSD +=
      pricingConfig.requestCount.basePriceUSD *
      (usage.requestCount / pricingConfig.requestCount.per);
  }
  if (
    usage.type === 'api_1' &&
    usage.requestData &&
    pricingConfig.requestData
  ) {
    usagePriceUSD +=
      pricingConfig.requestData.basePriceUSD *
      (usage.requestData / pricingConfig.requestData.per);
  }
  return {
    ...usage,
    priceUSD: usagePriceUSD,
  } as Usage;
};

export const attachPricingLLM = (usage: Usage) => {
  const pricingConfig = (PricingConfig as any)[usage.package];
  if (!pricingConfig) {
    return {
      ...usage,
      priceUSD: 0,
    } as Usage;
  }
  let usagePriceUSD = 0;
  if (usage.type != 'llm' || !usage.model) {
    return usage;
  }
  let modelPricingConfig = (pricingConfig as any)[usage.model];
  if (!modelPricingConfig) {
    return usage;
  }
  usagePriceUSD +=
    modelPricingConfig.promptToken.basePriceUSD *
    (usage.promptTokens / modelPricingConfig.promptToken.per);
  usagePriceUSD +=
    modelPricingConfig.completionToken.basePriceUSD *
    (usage.completionTokens / modelPricingConfig.completionToken.per);
  return {
    ...usage,
    priceUSD: usagePriceUSD,
  } as Usage;
};

export const attachPricing = (usage: Usage) => {
  if (usage.type === 'llm') {
    return attachPricingLLM(usage);
  }
  if (usage.type === 'api_1') {
    return attachPricingApi1(usage);
  }
};
