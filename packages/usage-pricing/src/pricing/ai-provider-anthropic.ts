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

export const AnthropicAIPricingConfig = {
  ['ai-provider-anthropic']: {
    type: 'llm',
    // Claude 4 Models
    ['claude-4-opus-20250514']: {
      promptToken: {
        basePriceUSD: 15.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 75.0,
        ...commonPricingCompletion,
      },
    },
    ['laude-4-sonnet-20250514']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    // Claude 3.7 Models
    ['claude-3-7-sonnet-20250219']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    // Claude 3.5 Models
    ['claude-3-5-sonnet-20241022']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    ['claude-3-5-sonnet-20240620']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    ['claude-3-5-haiku-20241022']: {
      promptToken: {
        basePriceUSD: 0.8,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 4.0,
        ...commonPricingCompletion,
      },
    },
    // Claude 3 Models
    ['claude-3-opus-20240229']: {
      promptToken: {
        basePriceUSD: 15.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 75.0,
        ...commonPricingCompletion,
      },
    },
    ['claude-3-sonnet-20240229']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    ['claude-3-haiku-20240307']: {
      promptToken: {
        basePriceUSD: 0.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.25,
        ...commonPricingCompletion,
      },
    },
  },
};
