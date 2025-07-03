import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProvider,
} from '@ai-sdk/google';
import { LanguageModelV2Middleware } from '@ai-sdk/provider';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import { wrapLanguageModel } from 'ai';
import {
  GoogleEmbeddingModelId,
  GoogleGenerativeAISettings,
  GoogleImageModelId,
  GoogleLanguageModelId,
} from './types';

export class GoogleAiProvider {
  private middleware: LanguageModelV2Middleware;
  private apiKey: string;
  private googleGenerativeAI: GoogleGenerativeAIProvider;

  constructor(props: {
    apiKey: string;
    middleware?: LanguageModelV2Middleware;
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
            'ai-provider-google',
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

    this.googleGenerativeAI = createGoogleGenerativeAI({
      apiKey: this.apiKey,
    });
  }

  // Method to update middleware
  setMiddleware(middleware: LanguageModelV2Middleware) {
    this.middleware = middleware;
  }

  languageModel(modelId: GoogleLanguageModelId) {
    return wrapLanguageModel({
      model: this.googleGenerativeAI.languageModel(modelId),
      middleware: this.middleware,
    });
  }

  textEmbeddingModel(modelId: GoogleEmbeddingModelId) {
    return this.googleGenerativeAI.textEmbeddingModel(modelId);
  }

  imageModel(modelId: GoogleImageModelId) {
    return this.googleGenerativeAI.imageModel?.(modelId);
  }
}
