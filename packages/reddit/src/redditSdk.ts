import { createRedditOAuth } from '@microfox/reddit-oauth';
import { RedditSDKConfig } from './types';
import { redditSDKConfigSchema } from './schemas';

import { Endpoints } from './routes';

export class RedditApiError extends Error {
  public statusCode: number;
  public body: any;

  constructor(message: string, statusCode: number, body: any) {
    super(message);
    this.name = 'RedditApiError';
    this.statusCode = statusCode;
    this.body = body;
  }
}

type EndpointMethods = {
  [key in keyof typeof Endpoints]: {
    [key2 in keyof (typeof Endpoints)[key]]: (params?: any) => Promise<any>;
  };
};

export class RedditSDK {
  private oauth: ReturnType<typeof createRedditOAuth>;
  private accessToken: string;
  private refreshToken?: string;
  private baseUrl = 'https://oauth.reddit.com';
  private isRefreshing = false; // Flag to prevent infinite recursion

  constructor(config: RedditSDKConfig) {
    const validatedConfig = redditSDKConfigSchema.parse(config);
    this.oauth = createRedditOAuth({
      clientId: validatedConfig.clientId,
      clientSecret: validatedConfig.clientSecret,
    });
    this.accessToken = validatedConfig.accessToken;
    this.refreshToken = validatedConfig.refreshToken ?? undefined;
  }

  public async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('Refresh token not found');
    }
    if (this.isRefreshing) {
      throw new Error('Token refresh already in progress');
    }

    this.isRefreshing = true;
    try {
      const { access_token: accessToken } = await this.oauth.refreshAccessToken(
        this.refreshToken,
      );
      this.accessToken = accessToken;
    } finally {
      this.isRefreshing = false;
    }
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: unknown,
    contentType: 'application/json' | 'application/x-www-form-urlencoded' = 'application/json',
  ): Promise<T> {
    let response: Response;
    let requestBody: BodyInit | undefined;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    if (body) {
      if (contentType === 'application/json') {
        requestBody = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      } else if (contentType === 'application/x-www-form-urlencoded') {
        requestBody = new URLSearchParams(body as Record<string, string>).toString();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
    }

    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: requestBody,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Network request failed: ${error.message}`);
      }
      throw new Error('An unknown network error occurred during the request.');
    }

    if (response.status === 401 && !this.isRefreshing) {
      try {
        await this.refreshAccessToken();
        // Retry the original request with the new token
        return this.request(endpoint, method, body, contentType);
      } catch (refreshError) {
        throw new Error(
          `Failed to refresh access token: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`,
        );
      }
    }

    if (!response.ok) {
      let errorBody: any = null;
      let errorMessage = `Reddit API error: ${response.status} ${response.statusText}`;

      try {
        const text = await response.text();
        try {
          errorBody = JSON.parse(text);
          const { reason, explanation, message } = errorBody;
          if (reason) errorMessage += ` - Reason: ${reason}`;
          if (explanation) errorMessage += ` - Explanation: ${explanation}`;
          if (message) errorMessage += ` - Message: ${message}`;
        } catch (e) {
          // Body is not JSON, use the raw text if available
          errorBody = text;
        }
      } catch (e) {
        // Could not read body, stick with the original message
      }

      throw new RedditApiError(errorMessage, response.status, errorBody);
    }

    // Handle successful responses with no content
    if (response.status === 202 || response.status === 204) {
      return '' as unknown as T;
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
      const json = await response.json();
      return json as T;
    }

    return response.text() as unknown as T;
  }

  public api: EndpointMethods = new Proxy({} as EndpointMethods, {
    get: (target: any, prop: string) => {
      if (!target[prop]) {
        target[prop] = new Proxy(
          {},
          {
            get: (subTarget: any, subProp: string) => {
              if (!subTarget[subProp]) {
                const endpointInfo = (Endpoints as any)[prop]?.[subProp];
                if (!endpointInfo) {
                  throw new Error(
                    `Endpoint ${prop}.${subProp} does not exist.`,
                  );
                }

                subTarget[subProp] = async (params: any = {}) => {
                  let url = endpointInfo.url;
                  const queryParams: Record<string, string> = {};
                  const bodyParams: Record<string, any> = {};

                  // Replace path parameters
                  for (const key in params) {
                    if (url.includes(`{${key}}`)) {
                      url = url.replace(`{${key}}`, String(params[key]));
                      delete params[key];
                    }
                  }

                  // Remove optional path segments that still contain placeholders
                  url = url.replace(/{\/[^}]*{[^}]+}[^}]*}/g, '');
                  // Unwrap the filled optional path segments
                  url = url.replace(/{(\/[^}]+)}/g, '$1');

                  let method = endpointInfo.method;
                  if (Array.isArray(method)) {
                    const providedMethod = (
                      params.method || method[0]
                    ).toUpperCase();
                    if (!method.includes(providedMethod)) {
                      throw new Error(
                        `Invalid method ${providedMethod} for endpoint ${prop}.${subProp}. Available methods are ${method.join(', ')}`,
                      );
                    }
                    method = providedMethod;
                    delete params.method;
                  }

                  // Separate query and body params
                  if (method === 'GET' || method === 'DELETE') {
                    Object.assign(queryParams, params);
                  } else {
                    Object.assign(bodyParams, params);
                  }

                  if (endpointInfo.params) {
                    Object.assign(
                      method === 'GET' || method === 'DELETE'
                        ? queryParams
                        : bodyParams,
                      endpointInfo.params,
                    );
                  }

                  let finalUrl = url;
                  if (Object.keys(queryParams).length > 0) {
                    const search = new URLSearchParams(queryParams).toString();
                    if (search) {
                      finalUrl += `?${search}`;
                    }
                  }

                  const body =
                    Object.keys(bodyParams).length > 0 ? bodyParams : undefined;

                  const result = await this.request(finalUrl, method, body, endpointInfo.contentType);

                  // If the endpoint has a response schema, parse the result using the schema
                  // if (endpointInfo.responseSchema) {
                  //   return endpointInfo.responseSchema.parse(result);
                  // }

                  return result;
                };
              }
              return subTarget[subProp];
            },
          },
        );
      }
      return target[prop];
    },
  });
}

export function createRedditSDK(config: RedditSDKConfig): RedditSDK {
  return new RedditSDK(config);
}
