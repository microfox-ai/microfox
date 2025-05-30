import { Usage, LLMUsage, BaseUsage } from '@microfox/usage-tracker';
import { OpenAIPricingConfig } from './ai-provider-openai';
import { AwsSesPricingConfig } from './aws-ses';
import { BravePricingConfig } from './brave';
import { UsageWithPricing } from '../types';
import { AnthropicAIPricingConfig } from './ai-provider-anthropic';
import { GoogleAIPricingConfig } from './ai-provider-google';
import { DeepSeekAIPricingConfig } from './ai-provider-deepseek';

/**
 * Configuration object containing pricing information for different services and providers.
 * Includes configurations for AWS SES, OpenAI, Google AI, Anthropic AI, and Brave.
 */
export const PricingConfig = {
  ...AwsSesPricingConfig,
  ...OpenAIPricingConfig,
  ...GoogleAIPricingConfig,
  ...AnthropicAIPricingConfig,
  ...DeepSeekAIPricingConfig,
  ...BravePricingConfig,
};

// Create a type that combines the base usage fields with LLM usage fields
type LLMUsageWithBase = Omit<LLMUsage, 'type'> &
  Omit<BaseUsage, 'package'> & {
    package?: string;
    type?: 'llm';
  };

/**
 * Attaches pricing information to API usage data.
 * Calculates the price based on request count and request data if available.
 *
 * @param usage - The usage data to attach pricing to
 * @returns Usage data with attached pricing information including priceUSD and originalPriceUSD
 */
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

/**
 * Fetches the provider package name for a given model.
 * Searches through all LLM configurations to find the matching provider.
 *
 * @param model - The model name to find the provider for
 * @returns The provider package name or undefined if not found
 */
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

/**
 * Attaches pricing information to LLM usage data.
 * Calculates the price based on prompt tokens and completion tokens.
 *
 * @param usage - The LLM usage data to attach pricing to
 * @returns Usage data with attached pricing information including priceUSD and originalPriceUSD
 */
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
    package: _package,
    priceUSD: usagePriceUSD * (1 - (usage.markup ?? 0) / 100),
    originalPriceUSD: usagePriceUSD,
  } as UsageWithPricing;
};

/**
 * Main function to attach pricing information to any type of usage data.
 * Routes the usage data to the appropriate pricing calculator based on the usage type.
 *
 * @param usage - The usage data to attach pricing to
 * @returns Usage data with attached pricing information
 */
export const attachPricing = (usage: Usage): UsageWithPricing => {
  if (usage.type === 'llm') {
    return attachPricingLLM(usage);
  }
  if (usage.type === 'api_1') {
    return attachPricingApi1(usage);
  }
  return usage;
};

export const getPricingForLLM = (props: {
  model: string;
  promptTokens: number;
  completionTokens: number;
  markup?: number;
}) => {
  const _package = fetchProviderPackage(props.model);
  if (!_package) {
    return {
      priceUSD: 0,
      originalPriceUSD: 0,
    };
  }
  const pricingConfig = (PricingConfig as any)[_package];
  if (!pricingConfig || !pricingConfig[props.model]) {
    return {
      priceUSD: 0,
      originalPriceUSD: 0,
    };
  }
  const modelPricingConfig = (pricingConfig as any)[props.model];
  const usagePriceUSD =
    modelPricingConfig.promptToken.basePriceUSD *
      (props.promptTokens / modelPricingConfig.promptToken.per) +
    modelPricingConfig.completionToken.basePriceUSD *
      (props.completionTokens / modelPricingConfig.completionToken.per);
  return {
    provider: _package?.replace('ai-provider-', ''),
    priceUSD: usagePriceUSD * (1 - (props.markup ?? 0) / 100),
    originalPriceUSD: usagePriceUSD,
  };
};
