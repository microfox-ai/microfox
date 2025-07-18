import { describe, it, expect, beforeEach } from 'vitest';
import { ColoruseSdk, type ColoruseSdkConfig } from '../coloruseSdk';

describe('ColoruseSdk', () => {
  let config: ColoruseSdkConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com',
      name: 'coloruse',
      version: '1.0.0',
    };
  });

  describe('Constructor', () => {
    it('should create an instance with valid config', () => {
      const sdk = new ColoruseSdk(config);
      expect(sdk).toBeInstanceOf(ColoruseSdk);
    });

    it('should throw error with invalid config', () => {
      const invalidConfig = { ...config, apiKey: '' };
      expect(() => new ColoruseSdk(invalidConfig)).toThrow();
    });
  });

  describe('Hello Method', () => {
    it('should return a successful greeting response', async () => {
      const sdk = new ColoruseSdk(config);
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
  //     const sdk = new ColoruseSdk(config);
  //     // Your test implementation
  //   });
  // });
});
