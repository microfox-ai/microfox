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

export const GoogleAIPricingConfig = {
  ['ai-provider-google']: {
    type: 'llm',
    // Gemini 2.5 Models
    ['gemini-2.5-pro-preview-05-06']: {
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-pro-preview-05-06-long-context']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-preview-05-20']: {
      promptToken: {
        basePriceUSD: 0.15,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.6,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-preview-05-20-thinking']: {
      promptToken: {
        basePriceUSD: 0.15,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 3.5,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-preview-native-audio-dialog']: {
      promptToken: {
        basePriceUSD: 1.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.6,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-exp-native-audio-thinking-dialog']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 1.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.6,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-preview-tts']: {
      promptToken: {
        basePriceUSD: 0.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-pro-preview-tts']: {
      promptToken: {
        basePriceUSD: 1.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 20.0,
        ...commonPricingCompletion,
      },
    },
    // Gemini 2.0 Models
    ['gemini-2.0-flash']: {
      promptToken: {
        basePriceUSD: 0.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.4,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.0-flash-audio']: {
      promptToken: {
        basePriceUSD: 0.7,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.4,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.0-flash-live-001']: {
      promptToken: {
        basePriceUSD: 0.35,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.5,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.0-flash-live-001-audio']: {
      promptToken: {
        basePriceUSD: 2.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 8.5,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.0-flash-lite']: {
      promptToken: {
        basePriceUSD: 0.075,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.3,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.0-flash-preview-image-generation']: {
      promptToken: {
        basePriceUSD: 0.039,
        dataUnit: 'image',
        per: 1,
        description: 'Per image',
      },
    },
    // Gemini 1.5 Models
    ['gemini-1.5-pro']: {
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 5.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-pro-long-context']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-flash']: {
      promptToken: {
        basePriceUSD: 0.075,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.3,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-flash-long-context']: {
      promptToken: {
        basePriceUSD: 0.15,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.6,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-flash-8b']: {
      promptToken: {
        basePriceUSD: 0.0375,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.15,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-flash-8b-long-context']: {
      promptToken: {
        basePriceUSD: 0.075,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.3,
        ...commonPricingCompletion,
      },
    },
    // Image Generation Models
    ['imagen-3.0-generate-002']: {
      promptToken: {
        basePriceUSD: 0.03,
        dataUnit: 'image',
        per: 1,
        description: 'Per image',
      },
    },
    // Video Generation Models
    ['veo-2.0-generate-001']: {
      promptToken: {
        basePriceUSD: 0.35,
        dataUnit: 'second',
        per: 1,
        description: 'Per second of video',
      },
    },
    // Embeddings Models
    ['gemini-embedding-exp']: {
      promptToken: {
        basePriceUSD: 0.15,
        dataUnit: 'token',
        per: 1_000,
        description: 'Per 1,000 tokens',
      },
    },
    ['text-embedding-004']: {
      promptToken: {
        basePriceUSD: 0.025,
        dataUnit: 'token',
        per: 1_000,
        description: 'Per 1,000 tokens',
      },
    },
    ['embedding-001']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 0.025,
        dataUnit: 'token',
        per: 1_000,
        description: 'Per 1,000 tokens',
      },
    },
    // Experimental Models
    ['gemini-2.0-pro-exp-02-05']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 5.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.0-flash-thinking-exp-01-21']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 0.15,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 3.5,
        ...commonPricingCompletion,
      },
    },
    ['gemini-exp-1206']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 5.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-exp-1121']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 5.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-exp-1114']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 5.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-pro-exp-0827']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 5.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-pro-exp-0801']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 5.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-flash-8b-exp-0924']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 0.0375,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.15,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-flash-8b-exp-0827']: {
      // Pricing unsure, needs to be checked
      promptToken: {
        basePriceUSD: 0.0375,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.15,
        ...commonPricingCompletion,
      },
    },
  },
};
