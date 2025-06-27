import { createVertex } from '@ai-sdk/google-vertex';
import { LanguageModelV2, LanguageModelV2Middleware } from '@ai-sdk/provider';
import { wrapLanguageModel } from 'ai';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';
import {
  VertexEmbeddingModelId,
  VertexImageModelId,
  VertexLanguageModelId,
} from './types';

// The AI SDK does not export the provider types, so we infer them
type Vertex = ReturnType<typeof createVertex>;

export class VertexProvider {
  private middleware: LanguageModelV2Middleware;
  private vertexProvider: Vertex;

  constructor(props?: {
    middleware?: LanguageModelV2Middleware;
    project?: string;
    location?: string;
  }) {
    this.middleware =
      props?.middleware ||
      ({
        async transformParams({ type, params }) {
          return params;
        },
        async wrapGenerate({ doGenerate, params }) {
          const result = await doGenerate();
          if (result.response?.modelId) {
            const tracker = createDefaultMicrofoxUsageTracker();
            if (tracker) {
              tracker.trackLLMUsage(
                '@microfox/ai-provider-vertex',
                result.response.modelId,
                {
                  inputTokens: result.usage.inputTokens ?? 0,
                  outputTokens: result.usage.outputTokens ?? 0,
                  cachedInputTokens: result.usage.cachedInputTokens ?? 0,
                  reasoningTokens: result.usage.reasoningTokens ?? 0,
                  totalTokens: result.usage.totalTokens ?? 0,
                },
              );
            }
          } else {
            console.warn('No model ID found in the result');
          }
          return result;
        },
        async wrapStream({ doStream, params }) {
          return doStream();
        },
      } as LanguageModelV2Middleware);

    this.vertexProvider = createVertex({
      project: props?.project,
      location: props?.location,
    });
  }

  setMiddleware(middleware: LanguageModelV2Middleware) {
    this.middleware = middleware;
  }

  languageModel(modelId: VertexLanguageModelId) {
    // return wrapLanguageModel({
    //   model: {
    //     ...this.vertexProvider.languageModel(modelId),
    //     specificationVersion: 'v2',
    //     supportedUrls: {},
    //   },
    //   middleware: this.middleware,
    // });
  }

  embedding(modelId: VertexEmbeddingModelId) {
    return this.vertexProvider.textEmbeddingModel(modelId);
  }

  image(modelId: VertexImageModelId) {
    return this.vertexProvider.image(modelId);
  }
}
