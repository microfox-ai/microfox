import { AnthropicProvider, createAnthropic } from '@ai-sdk/anthropic';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import { LanguageModelV1Middleware, wrapLanguageModel } from 'ai';
import { AnthropicMessagesSettings, AnthropicModelId } from './types';

export class AnthropicAiProvider {
  private middleware: LanguageModelV1Middleware;
  private apiKey: string;
  private anthropicProvider: AnthropicProvider;

  constructor(props: {
    apiKey: string;
    middleware?: LanguageModelV1Middleware;
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

    this.anthropicProvider = createAnthropic({
      apiKey: this.apiKey,
    });
  }

  // Method to update middleware
  setMiddleware(middleware: LanguageModelV1Middleware) {
    this.middleware = middleware;
  }

  languageModel(
    modelId: AnthropicModelId,
    settings?: AnthropicMessagesSettings,
  ) {
    return wrapLanguageModel({
      model: this.anthropicProvider.languageModel(modelId, {
        ...(settings ?? {}),
      }),
      middleware: this.middleware,
    });
  }

  textEmbeddingModel(modelId: AnthropicModelId) {
    return this.anthropicProvider.textEmbeddingModel(modelId);
  }
}
