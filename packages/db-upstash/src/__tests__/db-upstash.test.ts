import { describe, it, expect, beforeEach } from 'vitest';
import { DbUpstashSdk, type DbUpstashSdkConfig } from '../db-upstashSdk';

describe('DbUpstashSdk', () => {
  let config: DbUpstashSdkConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com',
      name: 'db-upstash',
      version: '1.0.0',
    };
  });

  describe('Constructor', () => {
    it('should create an instance with valid config', () => {
      const sdk = new DbUpstashSdk(config);
      expect(sdk).toBeInstanceOf(DbUpstashSdk);
    });

    it('should throw error with invalid config', () => {
      const invalidConfig = { ...config, apiKey: '' };
      expect(() => new DbUpstashSdk(invalidConfig)).toThrow();
    });
  });

  describe('Hello Method', () => {
    it('should return a successful greeting response', async () => {
      const sdk = new DbUpstashSdk(config);
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
  //     const sdk = new DbUpstashSdk(config);
  //     // Your test implementation
  //   });
  // });
});
