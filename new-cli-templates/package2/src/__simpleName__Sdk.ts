import { <%= className %>ConfigSchema } from './schemas';

/**
 * Configuration options for the <%= className %>
 */
export interface <%= className %>Config {
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
export interface <%= className %>Response<T = any> {
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
 * <%= className %> - A TypeScript SDK template
 * 
 * @example
 * \`\`\`typescript
 * import { <%= className %> } from '<%= packageName %>';
 * 
 * const sdk = new <%= className %>({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.example.com'
 * });
 * 
 * const result = await sdk.hello('World');
 * console.log(result.data);
 * \`\`\`
 */
export class <%= className %> {
  private config: <%= className %>Config;

  /**
   * Create a new <%= className %> instance
   * 
   * @param config - Configuration for the SDK
   */
  constructor(config: <%= className %>Config) {
    // Validate configuration using Zod schema
    this.config = <%= className %>ConfigSchema.parse(config);
  }

  /**
   * Get current configuration
   * 
   * @returns Copy of the current config
   */
  getConfig(): <%= className %>Config {
    return { ...this.config };
  }

  /**
   * Example hello method - replace with your own methods
   * 
   * @param name - Name to greet
   * @returns Promise with greeting response
   */
  async hello(name: string): Promise<<%= className %>Response<string>> {
    return {
      data: `Hello, ${name}! Welcome to ${this.config.name || '<%= simpleName %>'} SDK.`,
      success: true,
      status: 200,
      message: 'Success'
    };
  }

  // TODO: Add your SDK methods here
  // Example:
  // async getData(id: string): Promise<<%= className %>Response<any>> {
  //   // Your implementation
  // }
  
  // async createItem(data: any): Promise<<%= className %>Response<any>> {
  //   // Your implementation  
  // }
}
