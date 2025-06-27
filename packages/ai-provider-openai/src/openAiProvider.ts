import {
  createOpenAI,
  OpenAIProviderSettings,
  type OpenAIProvider as OpenAIP,
} from '@ai-sdk/openai';
import { LanguageModelV2Middleware } from '@ai-sdk/provider';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import { wrapLanguageModel } from 'ai';
import {
  OpenAILanguageModelId,
  OpenAIChatSettings,
  OpenAIEmbeddingModelId,
  OpenAIImageModelId,
} from './types';

export class OpenAiProvider {
  private middleware: LanguageModelV2Middleware;
  private apiKey: string;
  private openaiProvider: OpenAIP;

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
            'ai-provider-openai',
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

    this.openaiProvider = createOpenAI({
      apiKey: this.apiKey,
      baseURL: props.baseURL,
      headers: props.headers,
    });
  }

  // Method to update middleware
  setMiddleware(middleware: LanguageModelV2Middleware) {
    this.middleware = middleware;
  }

  languageModel(modelId: OpenAILanguageModelId) {
    return wrapLanguageModel({
      model: this.openaiProvider.languageModel(modelId),
      middleware: this.middleware,
    });
  }

  textEmbeddingModel(modelId: OpenAIEmbeddingModelId) {
    return this.openaiProvider.textEmbeddingModel(modelId);
  }

  imageModel(modelId: OpenAIImageModelId) {
    return this.openaiProvider.imageModel(modelId);
  }
}
