import { ColoruseSdkConfigSchema } from './schemas';

/**
 * Configuration options for the ColoruseSdk
 */
export interface ColoruseSdkConfig {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API (optional) */
  baseUrl?: string;
  /** SDK name identifier (optional) */
  name?: string;
  /** API version to use (optional) */
  version?: string;
}

/**
 * Standard response format for all SDK methods
 */
export interface ColoruseSdkResponse<T = any> {
  /** The response data */
  data: T;
  /** Whether the request was successful */
  success: boolean;
  /** HTTP status code */
  status: number;
  /** Response message */
  message: string;
  /** Error object if the request failed */
  error?: Error;
}

/**
 * ColoruseSdk - A TypeScript SDK template
 * 
 * @example
 * \`\`\`typescript
 * import { ColoruseSdk } from '@microfox/@microfox/coloruse';
 * 
 * const sdk = new ColoruseSdk({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.example.com'
 * });
 * 
 * const result = await sdk.hello('World');
 * console.log(result.data);
 * \`\`\`
 */
export class ColoruseSdk {
  private config: ColoruseSdkConfig;

  /**
   * Create a new ColoruseSdk instance
   * 
   * @param config - Configuration for the SDK
   */
  constructor(config: ColoruseSdkConfig) {
    // Validate configuration using Zod schema
    this.config = ColoruseSdkConfigSchema.parse(config);
  }

  /**
   * Get current configuration
   * 
   * @returns Copy of the current config
   */
  getConfig(): ColoruseSdkConfig {
    return { ...this.config };
  }

  /**
   * Example hello method - replace with your own methods
   * 
   * @param name - Name to greet
   * @returns Promise with greeting response
   */
  async hello(name: string): Promise<ColoruseSdkResponse<string>> {
    return {
      data: `Hello, ${name}! Welcome to ${this.config.name || 'coloruse'} SDK.`,
      success: true,
      status: 200,
      message: 'Success'
    };
  }

  // TODO: Add your SDK methods here
  // Example:
  // async getData(id: string): Promise<ColoruseSdkResponse<any>> {
  //   // Your implementation
  // }
  
  // async createItem(data: any): Promise<ColoruseSdkResponse<any>> {
  //   // Your implementation  
  // }
}
