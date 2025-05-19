/// <reference types="jest" />

import { OpenAiProvider } from '../openAiProvider';
import { createOpenAI } from '@ai-sdk/openai';
import { LanguageModelV1Middleware } from 'ai';

// THEESE ARE GENEATED USELSS DUMMY MOCK TESTS

// Mock the @ai-sdk/openai module
jest.mock('@ai-sdk/openai', () => ({
  createOpenAI: jest.fn(() => ({
    languageModel: jest.fn(() => ({
      generate: jest.fn(),
      stream: jest.fn(),
    })),
    imageModel: jest.fn(() => ({
      generate: jest.fn(),
    })),
    speechModel: jest.fn(() => ({
      generate: jest.fn(),
    })),
    transcriptionModel: jest.fn(() => ({
      generate: jest.fn(),
    })),
  })),
}));

describe('OpenAiProvider', () => {
  const mockApiKey = 'test-api-key';
  let provider: OpenAiProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new OpenAiProvider({ apiKey: mockApiKey });
  });

  describe('constructor', () => {
    it('should initialize with default middleware', () => {
      expect(createOpenAI).toHaveBeenCalledWith({
        apiKey: mockApiKey,
      });
    });

    it('should initialize with custom middleware', () => {
      const customMiddleware: LanguageModelV1Middleware = {
        transformParams: jest.fn(),
        wrapGenerate: jest.fn(),
        wrapStream: jest.fn(),
      };

      const providerWithMiddleware = new OpenAiProvider({
        apiKey: mockApiKey,
        middleware: customMiddleware,
      });

      expect(createOpenAI).toHaveBeenCalledWith({
        apiKey: mockApiKey,
      });
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
      const languageModel = provider.languageModel('gpt-4');
      expect(languageModel).toBeDefined();
    });
  });

  describe('languageModel', () => {
    it('should return a wrapped language model', () => {
      const model = provider.languageModel('gpt-4');
      expect(model).toBeDefined();
    });

    it('should handle different model IDs', () => {
      const models = ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'] as const;
      models.forEach(modelId => {
        const model = provider.languageModel(modelId);
        expect(model).toBeDefined();
      });
    });
  });

  describe('imageModel', () => {
    it('should return an image model', () => {
      const model = provider.imageModel('dall-e-3');
      expect(model).toBeDefined();
    });

    it('should handle different model IDs', () => {
      const models = ['dall-e-3', 'dall-e-2'] as const;
      models.forEach(modelId => {
        const model = provider.imageModel(modelId);
        expect(model).toBeDefined();
      });
    });
  });

  describe('speechModel', () => {
    it('should return a speech model', () => {
      const model = provider.speechModel('tts-1');
      expect(model).toBeDefined();
    });

    it('should throw error if speech model is not available', () => {
      // Mock the speechModel to be undefined
      (createOpenAI as jest.Mock).mockReturnValueOnce({
        languageModel: jest.fn(),
        imageModel: jest.fn(),
        speechModel: undefined,
        transcriptionModel: jest.fn(),
      });

      const providerWithoutSpeech = new OpenAiProvider({ apiKey: mockApiKey });
      expect(() => providerWithoutSpeech.speechModel('tts-1')).toThrow(
        'OpenAI provider not initialized',
      );
    });
  });

  describe('transcriptionModel', () => {
    it('should return a transcription model', () => {
      const model = provider.transcriptionModel('whisper-1');
      expect(model).toBeDefined();
    });

    it('should throw error if transcription model is not available', () => {
      // Mock the transcriptionModel to be undefined
      (createOpenAI as jest.Mock).mockReturnValueOnce({
        languageModel: jest.fn(),
        imageModel: jest.fn(),
        speechModel: jest.fn(),
        transcriptionModel: undefined,
      });

      const providerWithoutTranscription = new OpenAiProvider({
        apiKey: mockApiKey,
      });
      expect(() =>
        providerWithoutTranscription.transcriptionModel('whisper-1'),
      ).toThrow('OpenAI provider not initialized');
    });
  });
});
