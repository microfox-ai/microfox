import {
  createPerplexity,
  PerplexityProviderSettings,
  type PerplexityProvider as PerplexityP,
} from '@ai-sdk/perplexity';
import {
  LanguageModelV1,
  LanguageModelV1Middleware,
  wrapLanguageModel,
} from 'ai';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import {
  PerplexityLanguageModelId,
  PerplexityChatSettings,
} from './types';

export class PerplexityProvider {
  private middleware: LanguageModelV1Middleware;
  private apiKey: string;
  private perplexityProvider: PerplexityP;

  constructor(props: {
    apiKey: string;
    middleware?: LanguageModelV1Middleware;
  }) {
    this.apiKey = props.apiKey;

    // Default middleware if none provided
    this.middleware = props.middleware || {
      async transformParams({ type, params }) {
        return params;
      },
      async wrapGenerate({ doGenerate, params }) {
        const result = await doGenerate();
        if (result.response?.modelId) {
          const tracker = createDefaultMicrofoxUsageTracker();
          tracker?.trackLLMUsage(
            'ai-provider-perplexity',
            result.response.modelId,
            {
              promptTokens: result.usage.promptTokens,
              completionTokens: result.usage.completionTokens,
            },
          );
        } else {
          console.warn('No model ID found in the result');
        }
        return result;
      },
      async wrapStream({ doStream, params }) {
        return doStream();
      },
    };

    this.perplexityProvider = createPerplexity({
      apiKey: this.apiKey,
    });
  }

  // Method to update middleware
  setMiddleware(middleware: LanguageModelV1Middleware) {
    this.middleware = middleware;
  }

  languageModel(modelId: PerplexityLanguageModelId) {
    return wrapLanguageModel({
      model: this.perplexityProvider.languageModel(modelId),
      middleware: this.middleware,
    });
  }
} 