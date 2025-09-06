import { describe, it, expect, beforeEach } from 'vitest';
import { XsquareSdk, type XsquareSdkConfig } from '../xsquareSdk';

describe('XsquareSdk', () => {
  let config: XsquareSdkConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com',
      name: 'xsquare',
      version: '1.0.0',
    };
  });

  describe('Constructor', () => {
    it('should create an instance with valid config', () => {
      const sdk = new XsquareSdk(config);
      expect(sdk).toBeInstanceOf(XsquareSdk);
    });

    it('should throw error with invalid config', () => {
      const invalidConfig = { ...config, apiKey: '' };
      expect(() => new XsquareSdk(invalidConfig)).toThrow();
    });
  });

  describe('Hello Method', () => {
    it('should return a successful greeting response', async () => {
      const sdk = new XsquareSdk(config);
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
  //     const sdk = new XsquareSdk(config);
  //     // Your test implementation
  //   });
  // });
});
