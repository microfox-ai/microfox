import {
  createOpenAI,
  OpenAIProviderSettings,
  type OpenAIProvider as OpenAIP,
} from '@ai-sdk/openai';
import {
  LanguageModelV1,
  LanguageModelV1Middleware,
  wrapLanguageModel,
} from 'ai';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import {
  OpenAILanguageModelId,
  OpenAIChatSettings,
  OpenAIEmbeddingModelId,
  OpenAIImageModelId,
} from './types';

export class OpenAiProvider {
  private middleware: LanguageModelV1Middleware;
  private apiKey: string;
  private openaiProvider: OpenAIP;

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
            'ai-provider-openai',
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

    this.openaiProvider = createOpenAI({
      apiKey: this.apiKey,
    });
  }

  // Method to update middleware
  setMiddleware(middleware: LanguageModelV1Middleware) {
    this.middleware = middleware;
  }

  languageModel(modelId: OpenAILanguageModelId, settings?: OpenAIChatSettings) {
    return wrapLanguageModel({
      model: this.openaiProvider.languageModel(modelId, {
        ...(settings ?? {}),
        structuredOutputs: true,
      }),
      middleware: this.middleware,
    });
  }

  embedding(modelId: OpenAIEmbeddingModelId) {
    return this.openaiProvider.embedding(modelId);
  }

  textEmbeddingModel(modelId: OpenAIEmbeddingModelId) {
    return this.openaiProvider.textEmbeddingModel(modelId);
  }

  imageModel(modelId: OpenAIImageModelId) {
    return this.openaiProvider.imageModel(modelId);
  }

  image(modelId: OpenAIImageModelId, settings?: any) {
    return this.openaiProvider.image(modelId, settings);
  }

  speechModel(modelId: string) {
    if (!this.openaiProvider.speechModel) {
      throw new Error('OpenAI provider not initialized');
    }
    return this.openaiProvider.speech(modelId);
  }

  speech(modelId: string) {
    if (!this.openaiProvider.speech) {
      throw new Error('OpenAI provider not initialized');
    }
    return this.openaiProvider.speech(modelId);
  }

  transcription(modelId: string) {
    if (!this.openaiProvider.transcription) {
      throw new Error('OpenAI provider not initialized');
    }
    return this.openaiProvider.transcription(modelId);
  }

  transcriptionModel(modelId: string) {
    if (!this.openaiProvider.transcriptionModel) {
      throw new Error('OpenAI provider not initialized');
    }
    return this.openaiProvider.transcriptionModel(modelId);
  }
}
