import { describe, it, expect, beforeEach } from 'vitest';
import { RagUpstashSdk } from '../rag-upstashSdk';
import type { RagUpstashSdkConfig } from '../types';

describe('RagUpstashSdk', () => {
  let config: RagUpstashSdkConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com',
      name: 'rag-upstash',
      version: '1.0.0',
    };
  });

  describe('Constructor', () => {
    it('should create an instance with valid config', () => {
      const sdk = new RagUpstashSdk(config);
      expect(sdk).toBeInstanceOf(RagUpstashSdk);
    });

    it('should throw error with invalid config', () => {
      const invalidConfig = { ...config, apiKey: '' };
      expect(() => new RagUpstashSdk(invalidConfig)).toThrow();
    });
  });

  describe('Hello Method', () => {
    it('should return a successful greeting response', async () => {
      const sdk = new RagUpstashSdk(config);
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
  //     const sdk = new RagUpstashSdk(config);
  //     // Your test implementation
  //   });
  // });
});
