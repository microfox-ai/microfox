/**
 * NOTE: The pricing for Gemini 1.5 models is based on character counts, while this system tracks usage in tokens.
 * The conversion from characters to tokens is not straightforward.
 * The conversion factors used here are derived from Gemini 1.0 Pro, the only model with public pricing for both units.
 * - Input: pricePerToken = pricePerCharacter * 2
 * - Output: pricePerToken = pricePerCharacter * 1.333
 * This is an approximation and may not reflect the exact billing from Google.
 */

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

const commonPricingImage = {
  dataUnit: 'image',
  per: 1000,
  description: 'Per 1000 images',
};

const commonPricingEmbedding = {
  dataUnit: 'token',
  per: 1_000_000,
  description: 'Per 1 million embedding tokens',
};

export const VertexAIPricingConfig = {
  ['ai-provider-vertex']: {
    type: 'llm',

    // Gemini
    ['gemini-1.5-pro']: {
      promptToken: {
        basePriceUSD: 7.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 14.0,
        ...commonPricingCompletion,
      },
    },
    ['gemini-1.5-flash']: {
      promptToken: {
        basePriceUSD: 0.7,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.4,
        ...commonPricingCompletion,
      },
    },

    // Anthropic on Vertex
    ['claude-3-opus@20240229']: {
      promptToken: {
        basePriceUSD: 15.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 75.0,
        ...commonPricingCompletion,
      },
    },
    ['claude-3-5-sonnet@20240620']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    ['claude-3-sonnet@20240229']: {
      promptToken: {
        basePriceUSD: 3.0,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 15.0,
        ...commonPricingCompletion,
      },
    },
    ['claude-3-haiku@20240307']: {
      promptToken: {
        basePriceUSD: 0.25,
        ...commonPricingPrompt,
      },
      completionToken: {
        basePriceUSD: 1.25,
        ...commonPricingCompletion,
      },
    },

    // Embedding Models
    ['text-embedding-004']: {
      promptToken: {
        basePriceUSD: 0.2,
        ...commonPricingEmbedding,
      },
    },
  },
}; 