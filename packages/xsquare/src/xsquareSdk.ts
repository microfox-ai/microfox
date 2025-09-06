import { XsquareSdkConfigSchema } from './schemas';

/**
 * Configuration options for the XsquareSdk
 */
export interface XsquareSdkConfig {
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
export interface XsquareSdkResponse<T = any> {
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
 * XsquareSdk - A TypeScript SDK template
 * 
 * @example
 * \`\`\`typescript
 * import { XsquareSdk } from '@microfox/xsquare';
 * 
 * const sdk = new XsquareSdk({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.example.com'
 * });
 * 
 * const result = await sdk.hello('World');
 * console.log(result.data);
 * \`\`\`
 */
export class XsquareSdk {
  private config: XsquareSdkConfig;

  /**
   * Create a new XsquareSdk instance
   * 
   * @param config - Configuration for the SDK
   */
  constructor(config: XsquareSdkConfig) {
    // Validate configuration using Zod schema
    this.config = XsquareSdkConfigSchema.parse(config);
  }

  /**
   * Get current configuration
   * 
   * @returns Copy of the current config
   */
  getConfig(): XsquareSdkConfig {
    return { ...this.config };
  }

  /**
   * Example hello method - replace with your own methods
   * 
   * @param name - Name to greet
   * @returns Promise with greeting response
   */
  async hello(name: string): Promise<XsquareSdkResponse<string>> {
    return {
      data: `Hello, ${name}! Welcome to ${this.config.name || 'xsquare'} SDK.`,
      success: true,
      status: 200,
      message: 'Success'
    };
  }

  // TODO: Add your SDK methods here
  // Example:
  // async getData(id: string): Promise<XsquareSdkResponse<any>> {
  //   // Your implementation
  // }
  
  // async createItem(data: any): Promise<XsquareSdkResponse<any>> {
  //   // Your implementation  
  // }
}
