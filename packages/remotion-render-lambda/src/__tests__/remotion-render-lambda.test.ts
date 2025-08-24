import { describe, it, expect, beforeEach } from 'vitest';
import { RemotionRenderLambdaSdk, type RemotionRenderLambdaSdkConfig } from '../remotion-render-lambdaSdk';

describe('RemotionRenderLambdaSdk', () => {
  let config: RemotionRenderLambdaSdkConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com',
      name: 'remotion-render-lambda',
      version: '1.0.0',
    };
  });

  describe('Constructor', () => {
    it('should create an instance with valid config', () => {
      const sdk = new RemotionRenderLambdaSdk(config);
      expect(sdk).toBeInstanceOf(RemotionRenderLambdaSdk);
    });

    it('should throw error with invalid config', () => {
      const invalidConfig = { ...config, apiKey: '' };
      expect(() => new RemotionRenderLambdaSdk(invalidConfig)).toThrow();
    });
  });

  describe('Hello Method', () => {
    it('should return a successful greeting response', async () => {
      const sdk = new RemotionRenderLambdaSdk(config);
      const result = await sdk.hello('World');
      
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toContain('Hello, World!');
      expect(result.message).toBe('Success');
    });
  });

  // TODO: Add your own tests here
  // Example:
  // describe('Your API Method', () => {
  //   it('should do something', async () => {
  //     const sdk = new RemotionRenderLambdaSdk(config);
  //     // Your test implementation
  //   });
  // });
});
