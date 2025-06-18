const commonPricingPrompt = {
  dataUnit: 'token',
  per: 1_000_000,
  description: 'Per 1 million prompt token',
};

const commonPricingCompletion = {
  dataUnit: 'token',
  per: 1_000_000,
  description: 'Per 1 million completion token',
};

export const PerplexityAIPricingConfig = {
  ['ai-provider-perplexity']: {
    type: 'llm',
    // Sonar Models
    ['sonar']: {
      promptToken: {
        basePriceUSD: 1.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.0,
        ...commonPricingCompletion,
      },
    },
    ['sonar-pro']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    // Sonar Reasoning Models
    ['sonar-reasoning']: {
      promptToken: {
        basePriceUSD: 1.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 5.0,
        ...commonPricingCompletion,
      },
    },
    ['sonar-reasoning-pro']: {
      promptToken: {
        basePriceUSD: 2.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 8.0,
        ...commonPricingCompletion,
      },
    },
    // Sonar Deep Research Models
    ['sonar-deep-research']: {
      promptToken: {
        basePriceUSD: 2.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 8.0,
        ...commonPricingCompletion,
      },
    },
  },
}; 