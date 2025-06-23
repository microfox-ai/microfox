import { createVertex } from '@ai-sdk/google-vertex';
import { createVertexAnthropic } from '@ai-sdk/google-vertex/anthropic';
import {
  LanguageModelV1,
  LanguageModelV1Middleware,
  wrapLanguageModel,
} from 'ai';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import {
  VertexEmbeddingModelId,
  VertexImageModelId,
  VertexLanguageModelId,
} from './types';

// The AI SDK does not export the provider types, so we infer them
type Vertex = ReturnType<typeof createVertex>;
type VertexAnthropic = ReturnType<typeof createVertexAnthropic>;

export class VertexProvider {
  private middleware: LanguageModelV1Middleware;
  private vertexProvider: Vertex;
  private vertexAnthropicProvider: VertexAnthropic;

  constructor(props?: {
    middleware?: LanguageModelV1Middleware;
    project?: string;
    location?: string;
  }) {
    this.middleware =
      props?.middleware ||
      ({
        async wrapGenerate({ doGenerate, params }) {
          const result = await doGenerate();
          if (result.response?.modelId) {
            const tracker = createDefaultMicrofoxUsageTracker();
            if (tracker) {
              tracker.trackLLMUsage(
                '@microfox/ai-provider-vertex',
                result.response.modelId,
                {
                  completionTokens: result.usage.completionTokens,
                  promptTokens: result.usage.promptTokens,
                },
              );
            }
          } else {
            console.warn('No model ID found in the result');
          }
          return result;
        },
      } as LanguageModelV1Middleware);

    this.vertexProvider = createVertex({
      project: props?.project,
      location: props?.location,
    });
    this.vertexAnthropicProvider = createVertexAnthropic({
      project: props?.project,
      location: props?.location,
    });
  }

  setMiddleware(middleware: LanguageModelV1Middleware) {
    this.middleware = middleware;
  }

  languageModel(modelId: VertexLanguageModelId): LanguageModelV1 {
    if (modelId.startsWith('claude')) {
      return wrapLanguageModel({
        model: this.vertexAnthropicProvider(modelId),
        middleware: this.middleware,
      });
    }

    return wrapLanguageModel({
      model: this.vertexProvider(modelId),
      middleware: this.middleware,
    });
  }

  embedding(modelId: VertexEmbeddingModelId) {
    return this.vertexProvider.textEmbeddingModel(modelId);
  }

  image(modelId: VertexImageModelId) {
    return this.vertexProvider.image(modelId);
  }
} 