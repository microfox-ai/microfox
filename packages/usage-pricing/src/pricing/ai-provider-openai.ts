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

export const OpenAIPricingConfig = {
  ['ai-provider-openai']: {
    type: 'llm',
    // GPT-4.1 Models
    ['gpt-4.1']: {
      promptToken: {
        basePriceUSD: 2.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 8.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4.1-2025-04-14']: {
      promptToken: {
        basePriceUSD: 2.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 8.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4.1-mini']: {
      promptToken: {
        basePriceUSD: 0.4,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.6,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4.1-mini-2025-04-14']: {
      promptToken: {
        basePriceUSD: 0.4,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.6,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4.1-nano']: {
      promptToken: {
        basePriceUSD: 0.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.4,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4.1-nano-2025-04-14']: {
      promptToken: {
        basePriceUSD: 0.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.4,
        ...commonPricingCompletion,
      },
    },
    // GPT-4.5 Models
    ['gpt-4.5-preview']: {
      promptToken: {
        basePriceUSD: 75.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 150.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4.5-preview-2025-02-27']: {
      promptToken: {
        basePriceUSD: 75.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 150.0,
        ...commonPricingCompletion,
      },
    },
    // GPT-4o Models
    ['gpt-4o']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-2024-08-06']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-2024-11-20']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-2024-05-13']: {
      promptToken: {
        basePriceUSD: 5.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-mini']: {
      promptToken: {
        basePriceUSD: 0.15,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.6,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-mini-2024-07-18']: {
      promptToken: {
        basePriceUSD: 0.15,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.6,
        ...commonPricingCompletion,
      },
    },
    // Audio Models
    ['gpt-4o-audio-preview']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-audio-preview-2024-12-17']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-audio-preview-2024-10-01']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-mini-audio-preview']: {
      promptToken: {
        basePriceUSD: 0.15,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.6,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-mini-audio-preview-2024-12-17']: {
      promptToken: {
        basePriceUSD: 0.15,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.6,
        ...commonPricingCompletion,
      },
    },
    // Realtime Models
    ['gpt-4o-realtime-preview']: {
      promptToken: {
        basePriceUSD: 5.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 20.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-realtime-preview-2024-12-17']: {
      promptToken: {
        basePriceUSD: 5.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 20.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-realtime-preview-2024-10-01']: {
      promptToken: {
        basePriceUSD: 5.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 20.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-mini-realtime-preview']: {
      promptToken: {
        basePriceUSD: 0.6,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.4,
        ...commonPricingCompletion,
      },
    },
    ['gpt-4o-mini-realtime-preview-2024-12-17']: {
      promptToken: {
        basePriceUSD: 0.6,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.4,
        ...commonPricingCompletion,
      },
    },
    // O1 Models
    ['o1']: {
      promptToken: {
        basePriceUSD: 15.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 60.0,
        ...commonPricingCompletion,
      },
    },
    ['o1-2024-12-17']: {
      promptToken: {
        basePriceUSD: 15.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 60.0,
        ...commonPricingCompletion,
      },
    },
    ['o1-preview-2024-09-12']: {
      promptToken: {
        basePriceUSD: 15.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 60.0,
        ...commonPricingCompletion,
      },
    },
    ['o1-pro']: {
      promptToken: {
        basePriceUSD: 150.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 600.0,
        ...commonPricingCompletion,
      },
    },
    ['o1-pro-2025-03-19']: {
      promptToken: {
        basePriceUSD: 150.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 600.0,
        ...commonPricingCompletion,
      },
    },
    // O3 Models
    ['o3']: {
      promptToken: {
        basePriceUSD: 10.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 40.0,
        ...commonPricingCompletion,
      },
    },
    ['o3-2025-04-16']: {
      promptToken: {
        basePriceUSD: 10.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 40.0,
        ...commonPricingCompletion,
      },
    },
    ['o3-mini']: {
      promptToken: {
        basePriceUSD: 1.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 4.4,
        ...commonPricingCompletion,
      },
    },
    ['o3-mini-2025-01-31']: {
      promptToken: {
        basePriceUSD: 1.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 4.4,
        ...commonPricingCompletion,
      },
    },
    // O4 Models
    ['o4-mini']: {
      promptToken: {
        basePriceUSD: 1.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 4.4,
        ...commonPricingCompletion,
      },
    },
    ['o4-mini-2025-04-16']: {
      promptToken: {
        basePriceUSD: 1.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 4.4,
        ...commonPricingCompletion,
      },
    },
    // GPT-3.5 Models
    ['gpt-3.5-turbo']: {
      promptToken: {
        basePriceUSD: 0.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.5,
        ...commonPricingCompletion,
      },
    },
    ['gpt-3.5-turbo-0125']: {
      promptToken: {
        basePriceUSD: 0.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.5,
        ...commonPricingCompletion,
      },
    },
    ['gpt-3.5-turbo-1106']: {
      promptToken: {
        basePriceUSD: 1.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-3.5-turbo-0613']: {
      promptToken: {
        basePriceUSD: 1.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.0,
        ...commonPricingCompletion,
      },
    },
    ['gpt-3.5-turbo-16k-0613']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 4.0,
        ...commonPricingCompletion,
      },
    },
    // Embeddings Models
    ['text-embedding-3-small']: {
      promptToken: {
        basePriceUSD: 0.02,
        dataUnit: 'token',
        per: 1_000_000,
        description: 'Per 1 million tokens',
      },
    },
    ['text-embedding-3-large']: {
      promptToken: {
        basePriceUSD: 0.13,
        dataUnit: 'token',
        per: 1_000_000,
        description: 'Per 1 million tokens',
      },
    },
    ['text-embedding-ada-002']: {
      promptToken: {
        basePriceUSD: 0.1,
        dataUnit: 'token',
        per: 1_000_000,
        description: 'Per 1 million tokens',
      },
    },
  },
};
