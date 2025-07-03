import { AnthropicProvider, createAnthropic } from '@ai-sdk/anthropic';
import { LanguageModelV2Middleware } from '@ai-sdk/provider';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import { wrapLanguageModel } from 'ai';
import { AnthropicModelId } from './types';

export class AnthropicAiProvider {
  private middleware: LanguageModelV2Middleware;
  private apiKey: string;
  private anthropicProvider: AnthropicProvider;

  constructor(props: {
    apiKey: string;
    middleware?: LanguageModelV2Middleware;
    baseURL?: string;
    headers?: Record<string, string>;
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
            'ai-provider-anthropic',
            result.response.modelId,
            {
              inputTokens: result.usage.inputTokens ?? 0,
              outputTokens: result.usage.outputTokens ?? 0,
              cachedInputTokens: result.usage.cachedInputTokens ?? 0,
              reasoningTokens: result.usage.reasoningTokens ?? 0,
              totalTokens: result.usage.totalTokens ?? 0,
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

    this.anthropicProvider = createAnthropic({
      apiKey: this.apiKey,
    });
  }

  // Method to update middleware
  setMiddleware(middleware: LanguageModelV2Middleware) {
    this.middleware = middleware;
  }

  languageModel(modelId: AnthropicModelId) {
    return wrapLanguageModel({
      model: this.anthropicProvider.languageModel(modelId),
      middleware: this.middleware,
    });
  }

  textEmbeddingModel(modelId: AnthropicModelId) {
    return this.anthropicProvider.textEmbeddingModel(modelId);
  }
}
