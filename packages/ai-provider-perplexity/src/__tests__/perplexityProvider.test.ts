/// <reference types="jest" />

import { PerplexityProvider } from '../perplexityProvider';
import { createPerplexity } from '@ai-sdk/perplexity';
import { LanguageModelV1Middleware } from 'ai';

// Mock the @ai-sdk/perplexity module
jest.mock('@ai-sdk/perplexity', () => ({
  createPerplexity: jest.fn(() => ({
    languageModel: jest.fn(() => ({
      generate: jest.fn(),
      stream: jest.fn(),
    })),
  })),
}));

jest.mock('@microfox/usage-tracker', () => ({
  createDefaultMicrofoxUsageTracker: jest.fn(() => ({
    trackLLMUsage: jest.fn(),
  })),
}));

describe('PerplexityProvider', () => {
  const mockApiKey = 'test-api-key';
  let provider: PerplexityProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new PerplexityProvider({ apiKey: mockApiKey });
  });

  describe('constructor', () => {
    it('should initialize with default middleware', () => {
      expect(createPerplexity).toHaveBeenCalledWith({
        apiKey: mockApiKey,
      });
    });

    it('should initialize with custom middleware', () => {
      const customMiddleware: LanguageModelV1Middleware = {
        transformParams: jest.fn(),
        wrapGenerate: jest.fn(),
        wrapStream: jest.fn(),
      };

      const providerWithMiddleware = new PerplexityProvider({
        apiKey: mockApiKey,
        middleware: customMiddleware,
      });

      expect(createPerplexity).toHaveBeenCalledWith({
        apiKey: mockApiKey,
      });
      // You could add more assertions here to check if the middleware is used as expected
    });
  });

  describe('setMiddleware', () => {
    it('should update the middleware', () => {
      const newMiddleware: LanguageModelV1Middleware = {
        transformParams: jest.fn(),
        wrapGenerate: jest.fn(),
        wrapStream: jest.fn(),
      };

      provider.setMiddleware(newMiddleware);
      const languageModel = provider.languageModel('sonar');
      expect(languageModel).toBeDefined();
    });
  });

  describe('languageModel', () => {
    it('should return a wrapped language model', () => {
      const model = provider.languageModel('sonar');
      expect(model).toBeDefined();
    });

    it('should handle different model IDs', () => {
      const models = [
        'sonar-deep-research',
        'sonar-reasoning-pro',
        'sonar-reasoning',
        'sonar-pro',
        'sonar',
      ] as const;
      models.forEach(modelId => {
        const model = provider.languageModel(modelId);
        expect(model).toBeDefined();
      });
    });
  });
}); 