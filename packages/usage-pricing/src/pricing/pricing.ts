import { Usage, LLMUsage, BaseUsage } from '@microfox/usage-tracker';
import { OpenAIPricingConfig } from './ai-provider-openai';
import { AwsSesPricingConfig } from './aws-ses';
import { BravePricingConfig } from './brave';
import { UsageWithPricing } from '../types';
import { AnthropicAIPricingConfig } from './ai-provider-anthropic';
import { GoogleAIPricingConfig } from './ai-provider-google';

export const PricingConfig = {
  ...AwsSesPricingConfig,
  ...OpenAIPricingConfig,
  ...GoogleAIPricingConfig,
  ...AnthropicAIPricingConfig,
  ...BravePricingConfig,
};

// Create a type that combines the base usage fields with LLM usage fields
type LLMUsageWithBase = Omit<LLMUsage, 'package' | 'type'> & BaseUsage;

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

export const fetchProviderPackage = (model: string) => {
  const allLLmConfigs = Object.entries(PricingConfig)
    .map(([key, config]) => ({
      key,
      config,
    }))
    .filter(({ config }) => config.type === 'llm');
  const pricingConfigPackage = allLLmConfigs.find(({ config }) =>
    Object.keys(config).includes(model),
  )?.key;
  return pricingConfigPackage;
};
export const attachPricingLLM = (usage: LLMUsageWithBase): UsageWithPricing => {
  let _package: string | undefined = usage.package;
  if (!usage.model) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    } as UsageWithPricing;
  }
  if (!usage.package) {
    _package = fetchProviderPackage(usage.model);
  }
  if (!_package) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    } as UsageWithPricing;
  }
  const pricingConfig = (PricingConfig as any)[_package];
  if (!pricingConfig) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    } as UsageWithPricing;
  }
  let usagePriceUSD = 0;
  let modelPricingConfig = (pricingConfig as any)[usage.model];
  if (!modelPricingConfig) {
    return {
      ...usage,
      priceUSD: 0,
      originalPriceUSD: 0,
    } as UsageWithPricing;
  }
  usagePriceUSD +=
    modelPricingConfig.promptToken.basePriceUSD *
    ((usage.promptTokens ?? 0) / modelPricingConfig.promptToken.per);
  usagePriceUSD +=
    modelPricingConfig.completionToken.basePriceUSD *
    ((usage.completionTokens ?? 0) / modelPricingConfig.completionToken.per);
  return {
    ...usage,
    priceUSD: usagePriceUSD * (1 - (usage.markup ?? 0) / 100),
    originalPriceUSD: usagePriceUSD,
  } as UsageWithPricing;
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
