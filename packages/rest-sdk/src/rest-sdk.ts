/**
 * @packageDocumentation
 * A type-safe REST SDK for making HTTP requests with support for multiple response types,
 * retry mechanisms, and extensive configuration options.
 */

import { z } from 'zod';
import { MicrofoxSDKError, APICallError } from './errors';

// Zod schemas for SDK configuration
const RestHeadersSchema = z.record(z.string(), z.string());

const RestRequestOptionsSchema = z
  .object({
    query: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
    headers: RestHeadersSchema.optional(),
    body: z.unknown().optional(),
  })
  .strict();

const RestSDKConfigSchema = z
  .object({
    baseUrl: z.string().url(),
    headers: RestHeadersSchema.optional(),
    timeout: z.number().min(0).optional(),
  })
  .strict();

/**
 * Supported content types for requests
 */
export type ContentType =
  | 'application/json'
  | 'multipart/form-data'
  | 'application/x-www-form-urlencoded'
  | 'text/plain'
  | 'application/octet-stream';

// Enhanced request options
const EnhancedRestRequestOptionsSchema = RestRequestOptionsSchema.extend({
  contentType: z
    .enum([
      'application/json',
      'multipart/form-data',
      'application/x-www-form-urlencoded',
      'text/plain',
      'application/octet-stream',
    ])
    .optional(),
  responseType: z
    .enum(['json', 'text', 'blob', 'arrayBuffer', 'formData'])
    .optional(),
  retry: z
    .object({
      attempts: z.number().min(0).default(0),
      delay: z.number().min(0).default(1000),
      backoff: z.number().min(1).default(2),
    })
    .optional(),
  abortSignal: z.instanceof(AbortSignal).optional(),
  cache: z
    .enum(['default', 'no-store', 'reload', 'force-cache', 'only-if-cached'])
    .optional(),
  credentials: z.enum(['include', 'same-origin', 'omit']).optional(),
  keepalive: z.boolean().optional(),
  mode: z.enum(['cors', 'no-cors', 'same-origin']).optional(),
  redirect: z.enum(['follow', 'error', 'manual']).optional(),
  referrerPolicy: z
    .enum([
      'no-referrer',
      'no-referrer-when-downgrade',
      'origin',
      'origin-when-cross-origin',
      'same-origin',
      'strict-origin',
      'strict-origin-when-cross-origin',
      'unsafe-url',
    ])
    .optional(),
}).strict();

export type EnhancedRestRequestOptions<TBody = unknown> = z.infer<
  typeof EnhancedRestRequestOptionsSchema
> & {
  body?: TBody;
};

// SDK types
export type RestRequestOptions<TBody = unknown> = z.infer<
  typeof RestRequestOptionsSchema
> & {
  body?: TBody;
};

/**
 * Configuration options for the REST SDK
 * @property baseUrl - Base URL for all requests
 * @property headers - Global headers to be included in all requests
 * @property timeout - Request timeout in milliseconds (optional)
 * @property requestInterceptors - Array of request interceptor functions (optional)
 */
export interface RestSDKConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * RestClient interface representing the minimal requirements for a REST client
 */
export interface RestClient {
  /**
   * Get a resource
   * @param path - The path of the resource to get
   * @param options - The options for the request
   * @returns A promise resolving to the response
   */
  get: <T>(
    path: string,
    options?: Record<string, any>,
  ) => {
    json: () => Promise<T>;
    text: () => Promise<string>;
    blob: () => Promise<Blob>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    formData: () => Promise<FormData>;
    headers: () => Promise<Record<string, string>>;
    raw: () => Promise<Response>;
  };
  /**
   * Create a resource
   * @param path - The path of the resource to create
   * @param body - The body of the resource to create
   * @param options - The options for the request
   * @returns A promise resolving to the response
   */
  post: <T>(
    path: string,
    body: any,
    options?: Record<string, any>,
  ) => {
    json: () => Promise<T>;
    text: () => Promise<string>;
    blob: () => Promise<Blob>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    formData: () => Promise<FormData>;
    headers: () => Promise<Record<string, string>>;
    raw: () => Promise<Response>;
  };
  /**
   * Update a resource
   * @param path - The path of the resource to update
   * @param body - The body of the resource to update
   * @param options - The options for the request
   * @returns A promise resolving to the response
   */
  put: <T>(
    path: string,
    body: any,
    options?: Record<string, any>,
  ) => {
    json: () => Promise<T>;
    text: () => Promise<string>;
    blob: () => Promise<Blob>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    formData: () => Promise<FormData>;
    headers: () => Promise<Record<string, string>>;
    raw: () => Promise<Response>;
  };
  /**
   * Patch a resource
   * @param path - The path of the resource to patch
   * @param body - The body of the resource to patch
   * @param options - The options for the request
   * @returns A promise resolving to the response
   */
  patch: <T>(
    path: string,
    body: any,
    options?: Record<string, any>,
  ) => {
    json: () => Promise<T>;
    text: () => Promise<string>;
    blob: () => Promise<Blob>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    formData: () => Promise<FormData>;
    headers: () => Promise<Record<string, string>>;
    raw: () => Promise<Response>;
  };
  /**
   * Delete a resource
   * @param path - The path of the resource to delete
   * @param options - The options for the request
   * @returns A promise resolving to the response
   */
  delete: <T>(
    path: string,
    options?: Record<string, any>,
  ) => {
    json: () => Promise<T>;
    text: () => Promise<string>;
    blob: () => Promise<Blob>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    formData: () => Promise<FormData>;
    headers: () => Promise<Record<string, string>>;
    raw: () => Promise<Response>;
  };
}
/**
 * Response wrapper providing type-safe access to different response formats
 * @template T - Type of the expected JSON response
 */
export type SDKResponse<T> = {
  /** Parse response as JSON */
  json: () => Promise<T>;
  /** Get response as text */
  text: () => Promise<string>;
  /** Get response as Blob */
  blob: () => Promise<Blob>;
  /** Get response as ArrayBuffer */
  arrayBuffer: () => Promise<ArrayBuffer>;
  /** Get response as FormData */
  formData: () => Promise<FormData>;
  /** Get response headers */
  headers: () => Promise<Record<string, string>>;
  /** Get response status code */
  status: () => Promise<number>;
  /** Get response status text */
  statusText: () => Promise<string>;
  /** Get response ok status */
  ok: () => Promise<boolean>;
  /** Get raw Response object */
  raw: () => Promise<Response>;
};

/**
 * Creates a REST SDK instance with the provided configuration
 * @param config - SDK configuration options
 * @returns An object with methods for making HTTP requests
 *
 * @example
 * ```typescript
 * const api = createRestSDK({
 *   baseUrl: 'https://api.example.com',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 *
 * // Make a GET request
 * const data = await api.get('/users').json();
 * ```
 */
export const createRestSDK = (config: RestSDKConfig): RestClient => {
  const {
    baseUrl,
    headers: globalHeaders = {},
    timeout,
  } = RestSDKConfigSchema.parse(config);
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Formats the request body based on the content type
   * @param body - Request body
   * @param contentType - Content type of the request
   * @returns Formatted body or undefined if body is empty
   * @internal
   */
  const formatRequestBody = (
    body: unknown,
    contentType: ContentType,
  ): BodyInit | undefined => {
    if (body === undefined || body === null) {
      return undefined;
    }

    switch (contentType) {
      case 'application/json':
        return JSON.stringify(body);
      case 'multipart/form-data':
        if (body instanceof FormData) {
          return body;
        }
        const formData = new FormData();
        if (typeof body === 'object') {
          Object.entries(body as Record<string, any>).forEach(
            ([key, value]) => {
              if (value instanceof Blob) {
                formData.append(key, value);
              } else if (Array.isArray(value)) {
                value.forEach(item =>
                  formData.append(`${key}[]`, String(item)),
                );
              } else {
                formData.append(key, String(value));
              }
            },
          );
        }
        return formData;
      case 'application/x-www-form-urlencoded':
        if (typeof body === 'object') {
          return new URLSearchParams(body as Record<string, string>).toString();
        }
        return String(body);
      case 'text/plain':
        return String(body);
      case 'application/octet-stream':
        if (body instanceof Blob || body instanceof ArrayBuffer) {
          return body;
        }
        throw new MicrofoxSDKError({
          name: 'InvalidBodyError',
          message: 'Binary content type requires Blob or ArrayBuffer body',
        });
      default:
        return undefined;
    }
  };

  /**
   * Executes an HTTP request with retry capability
   * @param method - HTTP method
   * @param path - Request path
   * @param options - Request options
   * @returns Promise resolving to Response
   * @throws {APICallError} When server returns non-2xx status
   * @throws {MicrofoxSDKError} When request times out or other SDK errors occur
   * @internal
   */
  const executeRestRequest = async <TBody = unknown>(
    method: string,
    path: string,
    options?: EnhancedRestRequestOptions<TBody>,
  ): Promise<Response> => {
    const {
      query,
      headers: requestHeaders = {},
      body,
      contentType = 'application/json',
      retry = { attempts: 0, delay: 1000, backoff: 2 },
      abortSignal,
      cache,
      credentials = 'same-origin',
      keepalive = false,
      mode = 'cors',
      redirect = 'follow',
      referrerPolicy = 'no-referrer',
    } = options ?? {};

    // Normalize path and handle edge cases
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const endpointUrl = new URL(`${normalizedBaseUrl}${normalizedPath}`);

    // Handle query parameters
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v =>
              endpointUrl.searchParams.append(`${key}[]`, String(v)),
            );
          } else {
            endpointUrl.searchParams.append(key, String(value));
          }
        }
      });
    }

    const executeWithRetry = async (attempt: number = 0): Promise<Response> => {
      // Only create abort controller if timeout is specified
      let localAbortController: AbortController | undefined;
      let timeoutId: NodeJS.Timeout | undefined;

      try {
        // Handle timeout only if specified
        if (timeout) {
          localAbortController = new AbortController();
          timeoutId = setTimeout(() => localAbortController!.abort(), timeout);
        }

        // Determine the signal to use
        const signal = abortSignal
          ? localAbortController
            ? AbortSignal.any([abortSignal, localAbortController.signal])
            : abortSignal
          : localAbortController?.signal;

        const formattedBody = formatRequestBody(body, contentType);
        const fetchOptions: RequestInit = {
          method,
          headers: {
            ...globalHeaders,
            ...requestHeaders,
            ...(contentType !== 'multipart/form-data'
              ? { 'Content-Type': contentType }
              : {}),
          },
          body: formattedBody,
          credentials,
          keepalive,
          mode,
          redirect,
          referrerPolicy,
          ...(signal ? { signal } : {}),
        };

        if (cache) {
          fetchOptions.cache = cache;
        }

        const response = await fetch(endpointUrl.toString(), fetchOptions);

        if (!response.ok) {
          const responseHeaders: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          const error = new APICallError({
            message: `HTTP ${response.status} - ${response.statusText}`,
            url: endpointUrl.toString(),
            requestBodyValues: body,
            statusCode: response.status,
            responseHeaders,
          });

          // Retry on server errors if attempts remain
          if (response.status >= 500 && attempt < retry.attempts) {
            const nextDelay = retry.delay * Math.pow(retry.backoff, attempt);
            await sleep(nextDelay);
            return executeWithRetry(attempt + 1);
          }

          throw error;
        }

        return response;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError' && timeout) {
            throw new MicrofoxSDKError({
              name: 'RequestTimeoutError',
              message: `Request timeout after ${timeout}ms`,
            });
          }

          // Retry on network errors if attempts remain
          if (!(error instanceof APICallError) && attempt < retry.attempts) {
            const nextDelay = retry.delay * Math.pow(retry.backoff, attempt);
            await sleep(nextDelay);
            return executeWithRetry(attempt + 1);
          }

          throw error;
        }
        throw new MicrofoxSDKError({
          name: 'UnknownError',
          message: 'Unknown error occurred',
        });
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    return executeWithRetry();
  };

  /**
   * Wraps a Response promise with type-safe access methods
   * @param responsePromise - Promise resolving to Response
   * @returns Object with methods to access response in different formats
   * @internal
   */
  const wrapResponse = <T>(
    responsePromise: Promise<Response>,
  ): SDKResponse<T> => ({
    json: async () => {
      const response = await responsePromise;
      if (!isRestJsonResponse(response)) {
        throw new MicrofoxSDKError({
          name: 'InvalidResponseType',
          message: 'Response is not JSON',
        });
      }
      return response.json();
    },
    text: async () => {
      const response = await responsePromise;
      return response.text();
    },
    blob: async () => {
      const response = await responsePromise;
      return response.blob();
    },
    arrayBuffer: async () => {
      const response = await responsePromise;
      return response.arrayBuffer();
    },
    formData: async () => {
      const response = await responsePromise;
      return response.formData();
    },
    headers: async () => {
      const response = await responsePromise;
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      return headers;
    },
    status: async () => {
      const response = await responsePromise;
      return response.status;
    },
    statusText: async () => {
      const response = await responsePromise;
      return response.statusText;
    },
    ok: async () => {
      const response = await responsePromise;
      return response.ok;
    },
    raw: async () => {
      const response = await responsePromise;
      return response;
    },
  });

  return {
    get: <TResponse>(
      path: string,
      options?: Omit<EnhancedRestRequestOptions, 'body'>,
    ) => wrapResponse<TResponse>(executeRestRequest('GET', path, options)),

    post: <TResponse, TBody = unknown>(
      path: string,
      body: TBody,
      options?: Omit<EnhancedRestRequestOptions, 'body'>,
    ) =>
      wrapResponse<TResponse>(
        executeRestRequest('POST', path, { ...options, body }),
      ),

    put: <TResponse, TBody = unknown>(
      path: string,
      body: TBody,
      options?: Omit<RestRequestOptions, 'body'>,
    ) =>
      wrapResponse<TResponse>(
        executeRestRequest('PUT', path, { ...options, body }),
      ),

    patch: <TResponse, TBody = unknown>(
      path: string,
      body: TBody,
      options?: Omit<RestRequestOptions, 'body'>,
    ) =>
      wrapResponse<TResponse>(
        executeRestRequest('PATCH', path, { ...options, body }),
      ),

    delete: <TResponse>(
      path: string,
      options?: Omit<RestRequestOptions, 'body'>,
    ) => wrapResponse<TResponse>(executeRestRequest('DELETE', path, options)),
  };
};

/**
 * Checks if a Response contains JSON content
 * @param response - Response object to check
 * @returns boolean indicating if response is JSON
 * @internal
 */
export const isRestJsonResponse = (response: Response): boolean =>
  response.headers.get('content-type')?.includes('application/json') ?? false;
