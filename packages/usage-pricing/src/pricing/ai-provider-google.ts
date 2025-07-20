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

const commonPricingCache = {
  dataUnit: 'token',
  per: 1_000_000,
  description: 'Per 1 million tokens for context caching',
};

const commonPricingCacheStorage = {
  dataUnit: 'token',
  per: 1_000_000,
  description: 'Per 1 million tokens per hour for context caching storage',
};

export const GoogleAIPricingConfig = {
  ['ai-provider-google']: {
    type: 'llm',
    // Gemini 2.5 Models
    ['gemini-2.5-pro']: {
      promptToken: {
        basePriceUSD: 1.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.31,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 4.5,
        ...commonPricingCacheStorage,
      },
    },
    ['gemini-2.5-pro-long-context']: {
      promptToken: {
        basePriceUSD: 2.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.625,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 4.5,
        ...commonPricingCacheStorage,
      },
    },
    ['gemini-2.5-flash']: {
      promptToken: {
        basePriceUSD: 0.3,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.5,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.075,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
      },
    },
    ['gemini-2.5-flash-audio']: {
      promptToken: {
        basePriceUSD: 1.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.5,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.25,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
      },
    },
    ['gemini-2.5-flash-lite']: {
      promptToken: {
        basePriceUSD: 0.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.4,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.025,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
      },
    },
    ['gemini-2.5-flash-lite-audio']: {
      promptToken: {
        basePriceUSD: 0.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.4,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.125,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
      },
    },
    ['gemini-2.5-flash-lite-preview-06-17']: {
      promptToken: {
        basePriceUSD: 0.1,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.4,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.025,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
      },
    },
    ['gemini-2.5-flash-native-audio']: {
      promptToken: {
        basePriceUSD: 0.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-native-audio-audio']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 12.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-tts']: {
      promptToken: {
        basePriceUSD: 0.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 10.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-pro-tts']: {
      promptToken: {
        basePriceUSD: 1.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 20.0,
        ...commonPricingCompletion,
      },
    },
    // Legacy Gemini 2.5 Models (keeping for backward compatibility)
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
        basePriceUSD: 0.3,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.5,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-preview-05-20-thinking']: {
      promptToken: {
        basePriceUSD: 0.3,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.5,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-preview-native-audio-dialog']: {
      promptToken: {
        basePriceUSD: 0.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-2.5-flash-exp-native-audio-thinking-dialog']: {
      promptToken: {
        basePriceUSD: 0.5,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.0,
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
      cacheToken: {
        basePriceUSD: 0.025,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
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
      cacheToken: {
        basePriceUSD: 0.175,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
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
      cacheToken: {
        basePriceUSD: 0.3125,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 4.5,
        ...commonPricingCacheStorage,
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
      cacheToken: {
        basePriceUSD: 0.625,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 4.5,
        ...commonPricingCacheStorage,
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
      cacheToken: {
        basePriceUSD: 0.01875,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
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
      cacheToken: {
        basePriceUSD: 0.0375,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 1.0,
        ...commonPricingCacheStorage,
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
      cacheToken: {
        basePriceUSD: 0.01,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 0.25,
        ...commonPricingCacheStorage,
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
      cacheToken: {
        basePriceUSD: 0.02,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 0.25,
        ...commonPricingCacheStorage,
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
    ['imagen-4-standard']: {
      promptToken: {
        basePriceUSD: 0.04,
        dataUnit: 'image',
        per: 1,
        description: 'Per image',
      },
    },
    ['imagen-4-ultra']: {
      promptToken: {
        basePriceUSD: 0.06,
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
    ['veo-3-video-with-audio']: {
      promptToken: {
        basePriceUSD: 0.75,
        dataUnit: 'second',
        per: 1,
        description: 'Per second of video with audio',
      },
    },
    ['veo-3-video-without-audio']: {
      promptToken: {
        basePriceUSD: 0.5,
        dataUnit: 'second',
        per: 1,
        description: 'Per second of video without audio',
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
      promptToken: {
        basePriceUSD: 0.025,
        dataUnit: 'token',
        per: 1_000,
        description: 'Per 1,000 tokens',
      },
    },
    // Gemma Models (Free tier only)
    ['gemma-3-27b-it']: {
      promptToken: {
        basePriceUSD: 0.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.0,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.0,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 0.0,
        ...commonPricingCacheStorage,
      },
    },
    ['gemma-3n']: {
      promptToken: {
        basePriceUSD: 0.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 0.0,
        ...commonPricingCompletion,
      },
      cacheToken: {
        basePriceUSD: 0.0,
        ...commonPricingCache,
      },
      cacheStorageToken: {
        basePriceUSD: 0.0,
        ...commonPricingCacheStorage,
      },
    },
    // Experimental Models
    ['gemini-2.0-pro-exp-02-05']: {
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
      promptToken: {
        basePriceUSD: 0.3,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 2.5,
        ...commonPricingCompletion,
      },
    },
    ['gemini-exp-1206']: {
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
