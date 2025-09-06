import { RemotionRenderLambdaSdkConfigSchema } from './schemas';

/**
 * Configuration options for the RemotionRenderLambdaSdk
 */
export interface RemotionRenderLambdaSdkConfig {
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
export interface RemotionRenderLambdaSdkResponse<T = any> {
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
 * RemotionRenderLambdaSdk - A TypeScript SDK template
 * 
 * @example
 * \`\`\`typescript
 * import { RemotionRenderLambdaSdk } from '@microfox/remotion-render-lambda';
 * 
 * const sdk = new RemotionRenderLambdaSdk({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.example.com'
 * });
 * 
 * const result = await sdk.hello('World');
 * console.log(result.data);
 * \`\`\`
 */
export class RemotionRenderLambdaSdk {
  private config: RemotionRenderLambdaSdkConfig;

  /**
   * Create a new RemotionRenderLambdaSdk instance
   * 
   * @param config - Configuration for the SDK
   */
  constructor(config: RemotionRenderLambdaSdkConfig) {
    // Validate configuration using Zod schema
    this.config = RemotionRenderLambdaSdkConfigSchema.parse(config);
  }

  /**
   * Get current configuration
   * 
   * @returns Copy of the current config
   */
  getConfig(): RemotionRenderLambdaSdkConfig {
    return { ...this.config };
  }

  /**
   * Example hello method - replace with your own methods
   * 
   * @param name - Name to greet
   * @returns Promise with greeting response
   */
  async hello(name: string): Promise<RemotionRenderLambdaSdkResponse<string>> {
    return {
      data: `Hello, ${name}! Welcome to ${this.config.name || 'remotion-render-lambda'} SDK.`,
      success: true,
      status: 200,
      message: 'Success'
    };
  }

  // TODO: Add your SDK methods here
  // Example:
  // async getData(id: string): Promise<RemotionRenderLambdaSdkResponse<any>> {
  //   // Your implementation
  // }
  
  // async createItem(data: any): Promise<RemotionRenderLambdaSdkResponse<any>> {
  //   // Your implementation  
  // }
}
