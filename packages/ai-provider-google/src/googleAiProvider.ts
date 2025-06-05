import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProvider,
} from '@ai-sdk/google';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import {
  LanguageModelV1CallOptions,
  LanguageModelV1Middleware,
  LanguageModelV1StreamPart,
  wrapLanguageModel,
} from 'ai';
import {
  GoogleEmbeddingModelId,
  GoogleGenerativeAISettings,
  GoogleImageModelId,
  GoogleLanguageModelId,
} from './types';

export class GoogleAiProvider {
  private middleware: LanguageModelV1Middleware;
  private apiKey: string;
  private googleGenerativeAI: GoogleGenerativeAIProvider;

  constructor(props: {
    apiKey: string;
    middleware?: LanguageModelV1Middleware;
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

    this.googleGenerativeAI = createGoogleGenerativeAI({
      apiKey: this.apiKey,
    });
  }

  // Method to update middleware
  setMiddleware(middleware: LanguageModelV1Middleware) {
    this.middleware = middleware;
  }

  languageModel(
    modelId: GoogleLanguageModelId,
    settings?: GoogleGenerativeAISettings,
  ) {
    return wrapLanguageModel({
      model: this.googleGenerativeAI.languageModel(modelId, {
        ...(settings ?? {}),
        structuredOutputs: true,
      }),
      middleware: this.middleware,
    });
  }

  textEmbeddingModel(modelId: GoogleEmbeddingModelId) {
    return this.googleGenerativeAI.textEmbeddingModel(modelId);
  }

  imageModel(modelId: GoogleImageModelId) {
    return this.googleGenerativeAI.imageModel?.(modelId);
  }

  speechModel(modelId: string) {
    if (!this.googleGenerativeAI.speechModel) {
      throw new Error('Google Generative AI provider not initialized');
    }
    return this.googleGenerativeAI.speechModel(modelId);
  }

  transcriptionModel(modelId: string) {
    if (!this.googleGenerativeAI.transcriptionModel) {
      throw new Error('Google Generative AI provider not initialized');
    }
    return this.googleGenerativeAI.transcriptionModel?.(modelId);
  }
}
