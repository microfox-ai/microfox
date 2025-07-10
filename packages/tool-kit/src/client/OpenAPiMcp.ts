import { z } from 'zod';
import {
  OpenAPIDoc,
  OpenAPIOperation,
  JsonSchema,
  OpenAPIPath,
  FetchOptions,
  APIResponse,
  OpenAPIParameter,
  OpenAPIRequestBody,
  OpenAPISchema,
  ToolOptions,
  ToolResult,
  ToolSet,
  ToolExecuteSet,
  ToolMetadataSet,
  ToolExecuteFn,
  AuthObject,
  HumanInterventionDecision,
  HumanInterventionContext,
  PendingToolContext,
  ToolMetadata,
  AuthOptions,
} from '../types';
import { CryptoVault } from '@microfox/crypto-sdk';

/**
 * Individual client for interacting with a single API described by an OpenAPI schema
 */
export class OpenApiMCP {
  private schema: OpenAPIDoc;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private presetBodyFields: Record<string, any>;
  private onError?: (error: Error) => void;
  private operationMap: Map<
    string,
    OpenAPIOperation & { path: string; method: string }
  >;
  private name: string;
  private initialized: boolean = false;
  private schemaCache: Record<string, JsonSchema> = {};
  private mcp_version: string;
  private toolExecutions: Record<string, ToolExecuteFn> = {};
  private auth?: AuthObject;
  private getAuth?: (options: AuthOptions) => Promise<AuthObject>;
  private cleanAuth?: (auth: AuthObject) => Promise<AuthObject>;
  private getHumanIntervention?: (
    context: HumanInterventionContext,
  ) => Promise<HumanInterventionDecision>;
  private addPendingTool?: (context: PendingToolContext) => void;
  private cryptoVault?: CryptoVault;

  constructor(options: {
    schema: OpenAPIDoc;
    baseUrl?: string;
    headers?: Record<string, string>;
    presetBodyFields?: Record<string, any>;
    onError?: (error: Error) => void;
    name?: string;
    auth?: AuthObject;
    getAuth?: (options: AuthOptions) => Promise<AuthObject>;
    cleanAuth?: (auth: AuthObject) => Promise<AuthObject>;
    getHumanIntervention?: (
      context: HumanInterventionContext,
    ) => Promise<HumanInterventionDecision>;
    addPendingTool?: (context: PendingToolContext) => void;
  }) {
    this.schema = options.schema;
    this.baseUrl = options.baseUrl || '';
    this.defaultHeaders = options.headers || {};
    this.presetBodyFields = options.presetBodyFields || {};
    this.onError = options.onError;
    this.operationMap = new Map();
    this.name = options.name || 'openapi-tools-client';
    this.mcp_version = options?.schema?.info?.mcp_version || '1.0.0';
    this.auth = options.auth;
    this.getAuth = options.getAuth;
    this.cleanAuth = options.cleanAuth;
    this.getHumanIntervention = options.getHumanIntervention;
    this.addPendingTool = options.addPendingTool;
    if (options.auth?.encryptionKey) {
      this.cryptoVault = new CryptoVault({
        key: options.auth?.encryptionKey || '',
        keyFormat: 'base64',
        encryptionAlgo: 'aes-256-gcm',
        hashAlgo: 'sha256',
        outputEncoding: 'base64url',
      });
    }
  }

  /**
   * Get client name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Initialize the client
   */
  async init(): Promise<OpenApiMCP> {
    if (this.initialized) {
      return this;
    }

    try {
      // Set base URL from schema if not provided
      if (
        !this.baseUrl &&
        this.schema.servers &&
        this.schema.servers.length > 0
      ) {
        const serverUrl = this.schema.servers[0]?.url;
        if (serverUrl) {
          this.baseUrl = serverUrl;
        }
      }

      // Set up operation map
      this.setupOperationMap();

      this.initialized = true;
      return this;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error during initialization';

      if (this.onError && error instanceof Error) {
        this.onError(error);
      }

      throw new Error(`Failed to initialize OpenAPI client: ${errorMessage}`);
    }
  }

  private cleanUpMethodSchema(methodSchema: OpenAPIOperation) {
    const cleanedMethodSchema = JSON.parse(JSON.stringify(methodSchema)); // Deep copy

    if (this?.mcp_version === '1.0.1' || this?.mcp_version === '1.0.2') {
      const jsonContent =
        cleanedMethodSchema.requestBody?.content?.['application/json'];

      if (!jsonContent?.schema?.properties?.body?.properties?.arguments) {
        return cleanedMethodSchema;
      }

      const argumentsSchema =
        jsonContent.schema.properties.body.properties.arguments;

      let newProperties: Record<string, OpenAPISchema> | undefined;

      if (argumentsSchema.type === 'object' && argumentsSchema.properties) {
        newProperties = argumentsSchema.properties;
      } else if (
        argumentsSchema.type === 'array' &&
        argumentsSchema.items &&
        Array.isArray(argumentsSchema.items)
      ) {
        const items = argumentsSchema.items;
        newProperties = items.reduce(
          (
            acc: Record<string, OpenAPISchema>,
            arg: OpenAPISchema,
            index: number,
          ) => {
            acc[`arg_${index}`] = arg;
            return acc;
          },
          {},
        );
      }

      if (newProperties) {
        jsonContent.schema.properties = newProperties;
      }
    }
    return cleanedMethodSchema;
  }

  private setupOperationMap() {
    for (const [path, methods] of Object.entries(this.schema.paths)) {
      for (const [method, pathOperation] of Object.entries(
        methods as OpenAPIPath,
      )) {
        const operation = pathOperation;
        const operationId = this.generateOperationId(path, method, operation);

        this.operationMap.set(operationId, {
          ...operation,
          path,
          method: method.toUpperCase(),
        });
      }
    }
  }

  private generateOperationId(
    path: string,
    method: string,
    operation: OpenAPIOperation,
  ): string {
    // First priority: use the operationId from the schema if available
    if (operation.operationId) {
      return operation.operationId;
    }

    // Second priority: generate an ID from the path and method
    const pathPart = path
      .replace(/^\/|\/$/g, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/\/\{([^}]+)\}/g, '_by_$1')
      .replace(/\//g, '_');

    return `${method.toLowerCase()}_${pathPart}`;
  }

  private structureBodyForRequest(
    body: Record<string, any>,
    operation: OpenAPIOperation,
    finalAuth?: AuthObject,
  ): Record<string, any> {
    if (this?.mcp_version === '1.0.1') {
      return {
        body: {
          arguments: Array.isArray(body) ? Object.values(body) : body,
          auth: { ...(this.presetBodyFields.auth || {}), ...finalAuth },
          packageName: this.presetBodyFields.packageName,
        },
      };
    } else if (this?.mcp_version === '1.0.2') {
      return {
        body: {
          arguments: Array.isArray(body) ? Object.values(body) : body,
          packageName: this.presetBodyFields.packageName,
        },
      };
    }
    // For other versions, the body is passed as is.
    // The prepareRequest function will JSON.stringify it.
    return body;
  }

  private structureHeaders(auth?: AuthObject): Record<string, string> {
    const headers: Record<string, string> = {};
    let _cryptoVault = this.cryptoVault;
    if (!auth?.encryptionKey) {
      return headers;
    }
    if (!_cryptoVault || auth?.encryptionKey) {
      try {
        _cryptoVault = new CryptoVault({
          key: auth?.encryptionKey,
          keyFormat: 'base64',
          encryptionAlgo: 'aes-256-gcm',
          hashAlgo: 'sha256',
          outputEncoding: 'base64url',
        });
      } catch (error) {
        // console.error('Error creating crypto vault', error);
      }
    }
    if (auth && _cryptoVault) {
      const variables = auth.variables?.reduce(
        (
          acc: Record<string, string>,
          variable: { key: string; value: string },
        ) => {
          acc[variable.key] = variable.value;
          return acc;
        },
        {},
      );
      if (variables && Object.keys(variables).length > 0) {
        headers['x-auth-secrets'] = _cryptoVault.encrypt(
          JSON.stringify(variables),
        );
      }
    } else {
      // console.warn('No auth provided');
    }
    return headers;
  }

  private prepareRequest(
    operation: OpenAPIOperation & { path: string; method: string },
    args: {
      path?: Record<string, any>;
      query?: Record<string, any>;
      headers?: Record<string, any>;
      body?: any;
    },
    authHeaders: Record<string, string>,
  ) {
    let url = `${this.baseUrl}${operation.path}`;
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      'Content-Type': 'application/json',
      ...authHeaders,
    };

    // Process path parameters
    if (args.path) {
      Object.entries(args.path).forEach(([name, value]) => {
        if (value !== undefined) {
          url = url.replace(`{${name}}`, encodeURIComponent(String(value)));
        }
      });
    }

    // Process query parameters
    if (args.query) {
      const queryString = Object.entries(args.query)
        .map(([name, value]) => {
          if (value !== undefined) {
            return `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('&');

      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Process header parameters
    if (args.headers) {
      Object.entries(args.headers).forEach(([name, value]) => {
        if (value !== undefined) {
          headers[name] = String(value);
        }
      });
    }

    // Prepare request body for POST/PUT/PATCH requests
    let body: string | undefined;
    if (
      ['POST', 'PUT', 'PATCH'].includes(operation.method) &&
      operation.requestBody?.content?.['application/json']?.schema
    ) {
      body = JSON.stringify(args.body);
    }

    return { url, headers, body };
  }

  private async makeRequest(options: FetchOptions): Promise<APIResponse> {
    const { url, method, headers, body, signal } = options;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal,
      });

      const contentType = response.headers.get('content-type') || '';
      let data;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType.includes('image/')) {
        data = await response.blob();
      } else {
        data = await response.text();
      }

      return {
        data,
        contentType,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }

      if (this.onError && error instanceof Error) {
        this.onError(error);
      }

      throw new Error(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  /**
   * List all available API operations from the OpenAPI schema
   * Operations are individual API endpoints defined in the OpenAPI schema
   */
  async listOperations() {
    if (!this.initialized) {
      throw new Error('Client not initialized. Call init() first.');
    }

    const operations: {
      id: string;
      summary?: string;
      description?: string;
      parameters?: OpenAPIParameter[];
      requestBody?: OpenAPIRequestBody;
      path: string;
      method: string;
    }[] = [];
    for (const [id, operation] of this.operationMap.entries()) {
      operations.push({
        id,
        summary: operation.summary,
        description: operation.description,
        parameters: operation.parameters,
        requestBody: operation.requestBody,
        path: operation.path,
        method: operation.method,
      });
    }

    return { operations };
  }

  /**
   * Call a specific API operation from the OpenAPI schema
   */
  async callOperation(
    id: string,
    args: Record<string, any> = {},
    options?: any,
    auth?: AuthObject,
  ) {
    if (!this.initialized) {
      throw new Error('Client not initialized. Call init() first.');
    }

    const operation = this.operationMap.get(id);
    if (!operation) {
      throw new Error(
        `Operation "${id}" not found. Available operations: ${Array.from(
          this.operationMap.keys(),
        ).join(', ')}`,
      );
    }

    // The AI will provide args in a structure that matches the JSON schema.
    // e.g., { path: { userId: '...' }, body: { ... } }
    const pathArgs = args.path || {};
    const queryArgs = args.query || {};
    const headerArgs = args.headers || {};
    let bodyArgs = args.body || {};

    // For operations without a defined requestBody, the AI might pass body
    // parameters at the top level. We should collect them.
    const knownParams = new Set(['path', 'query', 'headers', 'body']);
    const extraArgs = Object.fromEntries(
      Object.entries(args).filter(([key]) => !knownParams.has(key)),
    );
    if (Object.keys(extraArgs).length > 0) {
      bodyArgs = { ...bodyArgs, ...extraArgs };
    }

    // Apply the special mcp_version body structuring.
    const structuredBody = this.structureBodyForRequest(
      bodyArgs,
      operation,
      auth,
    );

    const requestArgs = {
      path: pathArgs,
      query: queryArgs,
      headers: headerArgs,
      body: structuredBody,
    };

    const authHeaders = this.structureHeaders(auth);

    const { url, headers, body } = this.prepareRequest(
      operation,
      requestArgs,
      authHeaders,
    );

    return this.makeRequest({
      url,
      method: operation.method,
      headers,
      body,
      signal: options?.abortSignal,
    });
  }

  /**
   * Convert operation to JSON Schema
   */
  private convertOperationToJsonSchema(
    operation: OpenAPIOperation & { path: string; method: string },
  ): JsonSchema & { type: 'object' } {
    const rootSchema: JsonSchema & { type: 'object' } = {
      type: 'object',
      properties: {},
      required: [],
      $defs: this.convertComponentsToJsonSchema(),
    };

    const paramGroups: {
      [key in 'path' | 'query' | 'header']: {
        schema: JsonSchema & {
          type: 'object';
          properties: Record<string, any>;
          required: string[];
        };
        params: OpenAPIParameter[];
      };
    } = {
      path: {
        schema: { type: 'object', properties: {}, required: [] },
        params: [],
      },
      query: {
        schema: { type: 'object', properties: {}, required: [] },
        params: [],
      },
      header: {
        schema: { type: 'object', properties: {}, required: [] },
        params: [],
      },
    };

    // Group parameters by 'in'
    if (operation.parameters) {
      for (const param of operation.parameters) {
        const group = paramGroups[param.in as keyof typeof paramGroups];
        if (group) {
          group.params.push(param);
        }
      }
    }

    // Process each parameter group
    for (const groupName of ['path', 'query', 'header'] as const) {
      const group = paramGroups[groupName];
      if (group.params.length > 0) {
        for (const param of group.params) {
          if (param.schema) {
            const paramSchema = this.convertOpenApiSchemaToJsonSchema(
              param.schema,
              new Set(),
            );
            if (param.description) {
              paramSchema.description = param.description;
            }
            group.schema.properties[param.name] = paramSchema;
            if (param.required) {
              group.schema.required.push(param.name);
            }
          }
        }
        rootSchema.properties![groupName] = group.schema;
        // Path parameter group is required if it has any params
        if (groupName === 'path' && group.params.length > 0) {
          rootSchema.required!.push('path');
        }
      }
    }

    // Handle request body
    if (operation.requestBody?.content?.['application/json']?.schema) {
      const bodySchema = this.convertOpenApiSchemaToJsonSchema(
        operation.requestBody.content['application/json'].schema,
        new Set(),
      );
      rootSchema.properties!.body = bodySchema;
      if (operation.requestBody.required) {
        rootSchema.required!.push('body');
      }
    }

    return rootSchema;
  }

  /**
   * Convert components to JSON Schema
   */
  private convertComponentsToJsonSchema(): Record<string, JsonSchema> {
    const components = this.schema.components || {};
    const schema: Record<string, JsonSchema> = {};
    for (const [key, value] of Object.entries(components.schemas || {})) {
      schema[key] = this.convertOpenApiSchemaToJsonSchema(value, new Set());
    }
    return schema;
  }

  /**
   * Resolve a $ref reference to its schema in the openApiSpec
   */
  private internalResolveRef(
    ref: string,
    resolvedRefs: Set<string>,
  ): OpenAPISchema | null {
    if (!ref.startsWith('#/')) {
      return null;
    }
    if (resolvedRefs.has(ref)) {
      return null;
    }

    const parts = ref.replace(/^#\//, '').split('/');
    let current: any = this.schema;
    for (const part of parts) {
      current = current[part];
      if (!current) return null;
    }
    resolvedRefs.add(ref);
    return current as OpenAPISchema;
  }

  /**
   * Convert OpenAPI schema to JSON Schema
   */
  private convertOpenApiSchemaToJsonSchema(
    schema: OpenAPISchema,
    resolvedRefs: Set<string>,
    resolveRefs: boolean = false,
  ): JsonSchema {
    if (schema.$ref) {
      const ref = schema.$ref;
      if (!resolveRefs) {
        if (ref.startsWith('#/components/schemas/')) {
          return {
            $ref: ref.replace(/^#\/components\/schemas\//, '#/$defs/'),
            ...(schema.description ? { description: schema.description } : {}),
          };
        }
      }

      const refSchema: JsonSchema = { $ref: ref };
      if (schema.description) {
        refSchema.description = schema.description;
      }

      if (this.schemaCache[ref]) {
        return this.schemaCache[ref];
      }

      const resolved = this.internalResolveRef(ref, resolvedRefs);
      if (!resolved) {
        return {
          $ref: ref.replace(/^#\/components\/schemas\//, '#/$defs/'),
          description: schema.description || '',
        };
      } else {
        const converted = this.convertOpenApiSchemaToJsonSchema(
          resolved,
          resolvedRefs,
          resolveRefs,
        );
        this.schemaCache[ref] = converted;
        return converted;
      }
    }

    const result: JsonSchema = {};

    if (schema.type) {
      result.type = schema.type;
    }

    if (schema.format === 'binary') {
      result.format = 'uri-reference';
      const binaryDesc = 'absolute paths to local files';
      result.description = schema.description
        ? `${schema.description} (${binaryDesc})`
        : binaryDesc;
    } else {
      if (schema.format) {
        result.format = schema.format;
      }
      if (schema.description) {
        result.description = schema.description;
      }
    }

    if (schema.enum) {
      result.enum = schema.enum;
    }

    if (schema.default !== undefined) {
      result.default = schema.default;
    }

    if (schema.type === 'object') {
      result.type = 'object';
      if (schema.properties) {
        result.properties = {};
        for (const [name, propSchema] of Object.entries(schema.properties)) {
          result.properties[name] = this.convertOpenApiSchemaToJsonSchema(
            propSchema,
            resolvedRefs,
            resolveRefs,
          );
        }
      }
      if (schema.required) {
        result.required = schema.required;
      }
      if (
        schema.additionalProperties === true ||
        schema.additionalProperties === undefined
      ) {
        result.additionalProperties = true;
      } else if (
        schema.additionalProperties &&
        typeof schema.additionalProperties === 'object'
      ) {
        result.additionalProperties = this.convertOpenApiSchemaToJsonSchema(
          schema.additionalProperties,
          resolvedRefs,
          resolveRefs,
        );
      } else {
        result.additionalProperties = false;
      }
    }

    if (schema.type === 'array') {
      result.type = 'array';
      if (schema.items) {
        // Handle both single schema and array of schemas (tuple validation)
        if (Array.isArray(schema.items)) {
          // For tuple validation, items is an array of schemas
          result.items = schema.items.map((itemSchema: OpenAPISchema) =>
            this.convertOpenApiSchemaToJsonSchema(
              itemSchema,
              resolvedRefs,
              resolveRefs,
            ),
          );
        } else {
          // For regular arrays, items is a single schema
          result.items = this.convertOpenApiSchemaToJsonSchema(
            schema.items,
            resolvedRefs,
            resolveRefs,
          );
        }
      } else {
        // If no items specified, default to object type for Google AI compatibility
        result.items = {
          type: 'object',
          additionalProperties: true,
        };
      }
    }

    if (schema.oneOf) {
      result.oneOf = schema.oneOf.map((s: OpenAPISchema) =>
        this.convertOpenApiSchemaToJsonSchema(s, resolvedRefs, resolveRefs),
      );
    }
    if (schema.anyOf) {
      result.anyOf = schema.anyOf.map((s: OpenAPISchema) =>
        this.convertOpenApiSchemaToJsonSchema(s, resolvedRefs, resolveRefs),
      );
    }
    if (schema.allOf) {
      result.allOf = schema.allOf.map((s: OpenAPISchema) =>
        this.convertOpenApiSchemaToJsonSchema(s, resolvedRefs, resolveRefs),
      );
    }

    return result;
  }

  /**
   * Convert OpenAPI schema to Zod schema
   * Ensures that any property not in the required array is made optional
   * Ensures arrays have proper item schemas for AI SDK compatibility
   */
  private convertOpenApiSchemaToZod(schema: JsonSchema): z.ZodType {
    if (!schema.type) {
      return z.any();
    }

    switch (schema.type) {
      case 'string':
        let stringSchema = z.string();
        // Only use formats supported by Google AI API
        if (schema.format === 'date-time') {
          stringSchema = z.string().datetime();
        }
        if (schema.description) {
          stringSchema = stringSchema.describe(schema.description);
        }
        return stringSchema;

      case 'number':
      case 'integer':
        let numberSchema =
          schema.type === 'integer' ? z.number().int() : z.number();
        if (schema.description) {
          numberSchema = numberSchema.describe(schema.description);
        }
        return numberSchema;

      case 'boolean':
        let booleanSchema = z.boolean();
        if (schema.description) {
          booleanSchema = booleanSchema.describe(schema.description);
        }
        return booleanSchema;

      case 'array':
        // For arrays, always ensure we have a proper item schema
        let itemSchema: z.ZodType;

        if (!schema.items) {
          // Use passthrough object instead of z.record for better JSON schema generation
          itemSchema = z.object({}).passthrough();
        } else if (Array.isArray(schema.items)) {
          if (schema.items.length === 0) {
            itemSchema = z.object({}).passthrough();
          } else {
            const firstItemSchema = schema.items[0];
            if (!firstItemSchema) {
              itemSchema = z.object({}).passthrough();
            } else {
              itemSchema = this.convertOpenApiSchemaToZod(firstItemSchema);
            }
          }
        } else {
          itemSchema = this.convertOpenApiSchemaToZod(schema.items);
        }

        let arraySchema = z.array(itemSchema);
        if (schema.description) {
          arraySchema = arraySchema.describe(schema.description);
        }
        return arraySchema;

      case 'object':
        if (!schema.properties || Object.keys(schema.properties).length === 0) {
          // Use passthrough for better JSON schema generation
          return z.object({}).passthrough();
        }

        const shape: Record<string, z.ZodType> = {};

        // Convert all properties first
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          const propZodSchema = this.convertOpenApiSchemaToZod(propSchema);

          // Check if this property is required
          const isRequired = schema.required && schema.required.includes(key);
          if (isRequired) {
            shape[key] = propZodSchema;
          } else {
            shape[key] = propZodSchema.optional();
          }
        }

        let objectSchema = z.object(shape);
        if (schema.description) {
          objectSchema = objectSchema.describe(schema.description);
        }

        return objectSchema;

      default:
        return z.any();
    }
  }

  //Each tool call must have a corresponding tool result. If you do not add a tool result, all subsequent generations will fail
  //bypass execute function process it, and return void, to put a temp stop
  // format a dataStreamPart with tool_call, and speciall toolName, & some state args, that help
  // get answer and push this part jsut above the preivously paused part, making it look like,
  // when asked for pramod, what his best time to meet is, pramod answered in {slack} message that he wants to connect on tuesday. aslong with all result data
  // add/modify args & permit the execute function to be called,
  // human layer will tell what tool to call, to get permission / input but will not execute in here, as it does not know the client secrets
  /**
   * Returns a set of tools generated from the OpenAPI schema
   */
  async tools({
    schemas = 'automatic',
    validateParameters = false,
    disabledExecutions = [],
    disableAllExecutions = false,
    auth: toolAuth,
    getAuth: toolGetAuth,
    cleanAuth: toolCleanAuth,
    getHumanIntervention,
  }: ToolOptions = {}): Promise<ToolResult> {
    if (!this.initialized) {
      throw new Error('Client not initialized. Call init() first.');
    }

    const tools: ToolSet = {};
    const toolExecutions: ToolExecuteSet = {}; // Reset tool executions
    const metadata: ToolMetadataSet = {};

    // Get all available operations
    const { operations } = await this.listOperations();

    for (const [id, operation] of this.operationMap.entries()) {
      if (schemas !== 'automatic' && !schemas[id]) {
        continue;
      }

      const cleanedOperation = this.cleanUpMethodSchema(
        operation,
      ) as OpenAPIOperation & { path: string; method: string };
      if (!cleanedOperation.path || !cleanedOperation.method) continue;

      const toolName =
        cleanedOperation.name || cleanedOperation.operationId || id;

      const isDisabled =
        disableAllExecutions ||
        (Array.isArray(disabledExecutions) &&
          disabledExecutions.includes(toolName));

      const jsonSchema = this.convertOperationToJsonSchema(cleanedOperation);
      const zodSchema = this.convertOpenApiSchemaToZod(jsonSchema);
      // console.log(
      //   'cleanedOperation',
      //   JSON.stringify(cleanedOperation, null, 2),
      // );
      // console.log('jsonSchema', JSON.stringify(jsonSchema, null, 2));
      // console.log('zodSchema', JSON.stringify(zodSchema._type, null, 2));

      const toolMetaData: ToolMetadata = {
        toolName,
        clientName: this.name,
        summary: cleanedOperation.summary,
        description:
          cleanedOperation.description ||
          cleanedOperation.summary ||
          `${cleanedOperation.method} ${cleanedOperation.path}`,
        jsonSchema,
        humanLayer: {
          required: isDisabled,
        },
      };

      const executeFn: ToolExecuteFn = async (
        args: Record<string, any>,
        toolOptions?: ToolOptions & { toolCallId: string; auth?: AuthObject },
      ) => {
        // 1st decidee if this is a first execution  where HITL might stop it or second execution where its Hitted for obvious reasons.

        // If not paused, proceed with normal execution.
        let finalAuth: AuthObject | undefined;

        const authProvider = this.resolveAuthProvider(id);
        if (authProvider) {
          // ... (auth provider logic remains the same)
        }

        const authPreset =
          cleanedOperation.auth ||
          this.schema.components?.['x-auth-packages'] ||
          [];

        const packages = authPreset.filter(a => a.packageName);
        const customSecrets = authPreset.filter(a => a.variables);
        if (!finalAuth) {
          if (toolGetAuth) {
            finalAuth = await toolGetAuth({
              packages: packages as any,
              customSecrets: customSecrets as any,
            });
          } else if (toolAuth) {
            finalAuth = toolAuth;
          } else if (this.getAuth) {
            finalAuth = await this.getAuth({
              packages: packages as any,
              customSecrets: customSecrets as any,
            });
          } else if (this.auth) {
            finalAuth = this.auth;
          }
        }

        const cleanAuthFn = toolCleanAuth || this.cleanAuth;
        const { encryptionKey, ...cleanedAuth } = finalAuth || {};
        if (toolOptions?.auth) {
          finalAuth = {
            ...toolOptions?.auth,
            encryptionKey:
              toolOptions?.auth?.encryptionKey || finalAuth?.encryptionKey,
          };
        }
        // Human in the Loop Check at the point of execution
        if (getHumanIntervention) {
          // Clean the auth before passing to frontend for human intervention
          const authForHuman =
            cleanAuthFn && finalAuth
              ? await cleanAuthFn(finalAuth)
              : cleanedAuth;
          const decision = await getHumanIntervention({
            toolName,
            generatedArgs: args,
            mcpConfig: cleanedOperation,
            toolCallId: toolOptions?.toolCallId || '',
            auth: authForHuman,
          });

          if (decision?.shouldPause) {
            // Return the special marker object for the orchestrator
            return {
              _humanIntervention: true,
              toolCallId: toolOptions?.toolCallId,
              args: decision.args,
              metadata: toolMetaData,
              auth: authForHuman,
            };
          }
        }

        if (disableAllExecutions) {
          // Clean the auth before passing to frontend for human intervention
          const authForHuman =
            cleanAuthFn && finalAuth
              ? await cleanAuthFn(finalAuth)
              : cleanedAuth;
          return {
            _humanIntervention: true,
            toolCallId: toolOptions?.toolCallId,
            args: args,
            metadata: toolMetaData,
            auth: authForHuman,
          };
        }

        // Call the operation (do not clean auth here)
        return this.callOperation(id, args, toolOptions, finalAuth);
      };

      tools[toolName] = {
        type: 'function',
        toolName,
        clientName: this.name,
        inputSchema: zodSchema,
        summary: cleanedOperation.summary,
        description:
          cleanedOperation.description ||
          cleanedOperation.summary ||
          `${cleanedOperation.method} ${cleanedOperation.path}`,
        execute: executeFn, //isDisabled ? undefined : executeFn,
      };
      toolExecutions[toolName] = executeFn;
      metadata[toolName] = toolMetaData;
    }

    return { tools, executions: toolExecutions, metadata };
  }

  /**
   * Get the execute callback for a specific tool
   */
  getToolExecution(id: string): ToolExecuteFn | undefined {
    return this.toolExecutions[id];
  }

  private resolveAuthProvider(operationId: string): any | undefined {
    const operationDetails = this.operationMap.get(operationId);
    const schema = this.schema as any;

    let authDirective = (operationDetails as any)?.auth ?? schema.auth;

    if (!authDirective) {
      return undefined;
    }

    // If the auth directive is an object, it's an inline provider definition
    if (typeof authDirective === 'object') {
      return authDirective;
    }

    // If it's a string, it's a reference to a provider in components
    if (typeof authDirective === 'string') {
      return schema.components?.['x-auth-providers']?.[authDirective];
    }

    return undefined;
  }

  private resolveJsonPath(obj: any, path: string): any {
    if (!path.startsWith('$.')) return undefined;
    const keys = path.substring(2).split('.');
    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined) return undefined;
      current = current[key];
    }
    return current;
  }

  private processResponseMapping(mapping: any, responseData: any): any {
    if (typeof mapping === 'string') {
      if (mapping.startsWith("'") && mapping.endsWith("'")) {
        return mapping.substring(1, mapping.length - 1); // It's a literal
      }
      if (mapping.startsWith('$.')) {
        return this.resolveJsonPath(responseData, mapping); // It's a JSONPath
      }
      return mapping;
    }
    if (Array.isArray(mapping)) {
      return mapping.map(item =>
        this.processResponseMapping(item, responseData),
      );
    }
    if (typeof mapping === 'object' && mapping !== null) {
      const newObj: { [key: string]: any } = {};
      for (const key in mapping) {
        newObj[key] = this.processResponseMapping(mapping[key], responseData);
      }
      return newObj;
    }
    return mapping;
  }
}
