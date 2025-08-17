import { CryptoVault } from '@microfox/crypto-sdk';
import {
  AuthObject,
  AuthOptions,
  OpenAPIDoc,
  OpenAPIOperation,
  OpenAPIPath,
} from '../types';
import { APIKeySecurityScheme, SecurityScheme } from '@microfox/types';

/**
 * Helper function to resolve a $ref reference in an OpenAPI schema
 */
function resolveRef(
  ref: string,
  schema: OpenAPIDoc,
  resolvedRefs: Set<string> = new Set(),
): any | null {
  if (!ref.startsWith('#/')) {
    return null;
  }
  if (resolvedRefs.has(ref)) {
    return null;
  }

  const parts = ref.replace(/^#\//, '').split('/');
  let current: any = schema;
  for (const part of parts) {
    current = current[part];
    if (!current) return null;
  }
  resolvedRefs.add(ref);
  return current;
}

/**
 * Helper function to find operation by ID in OpenAPI schema
 */
function findOperationById(
  schema: OpenAPIDoc,
  operationId: string,
): OpenAPIOperation | null {
  for (const [path, methods] of Object.entries(schema.paths)) {
    for (const [method, operation] of Object.entries(methods as OpenAPIPath)) {
      if (operation.operationId === operationId) {
        return operation;
      }
    }
  }

  // If no operationId match found, try generating an ID from path and method
  for (const [path, methods] of Object.entries(schema.paths)) {
    for (const [method, operation] of Object.entries(methods as OpenAPIPath)) {
      const generatedId = generateOperationId(path, method, operation);
      if (generatedId === operationId) {
        return operation;
      }
    }
  }

  return null;
}

/**
 * Helper function to generate operation ID from path and method
 */
function generateOperationId(
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

/**
 * Extracts auth options from an OpenAPI schema for a specific operation
 * @param schema The complete OpenAPI schema
 * @param operation The operation details or operation ID
 * @returns Auth options including packages and custom secrets
 */
export function getAuthOptions(
  schema: OpenAPIDoc,
  operation: OpenAPIOperation | string,
): AuthOptions {
  let operationDetails: OpenAPIOperation;

  // If operation is a string (operationId), find the corresponding operation
  if (typeof operation === 'string') {
    const foundOperation = findOperationById(schema, operation);
    if (!foundOperation) {
      throw new Error(`Operation "${operation}" not found in schema`);
    }
    operationDetails = foundOperation;
  } else {
    operationDetails = operation;
  }
  let packages: any = [];
  let customSecrets: any = [];
  let authConfig = operationDetails?.security?.[0] ?? schema?.security?.[0] ?? {};

  for (const [key, value] of Object.entries(authConfig)) {
    if (key === 'x-microfox-packages') {
      packages = value?.map((a: any) => {
        return {
          packageName: a,
          packageConstructor: [],
        };
      });
    } else {
      const customSecret =
        (schema?.components?.securitySchemes?.[key] as SecurityScheme)
          ?.type === 'apiKey'
          ? (schema?.components?.securitySchemes?.[key] as APIKeySecurityScheme)
          : null;
      if (customSecret) {
        customSecrets.push({
          key: customSecret?.name,
          description: customSecret?.description,
          required: true,
          type: customSecret?.type,
          format: customSecret?.in,
          enum: [],
          default: '',
        });
      }
    }
  }

  return {
    packages,
    customSecrets,
  };
}

/**
 * Constructs headers from an auth object, including encryption of secrets
 * @param auth The auth object containing encryption key and variables
 * @returns Record of headers
 */
export function constructHeaders(auth?: AuthObject): Record<string, string> {
  const headers: Record<string, string> = {};

  if (!auth?.encryptionKey) {
    return headers;
  }

  try {
    const cryptoVault = new CryptoVault({
      key: auth.encryptionKey,
      keyFormat: 'base64',
      encryptionAlgo: 'aes-256-gcm',
      hashAlgo: 'sha256',
      outputEncoding: 'base64url',
    });

    if (auth.variables?.length) {
      const variables = auth.variables.reduce(
        (
          acc: Record<string, string>,
          variable: { key: string; value: string },
        ) => {
          acc[variable.key] = variable.value;
          return acc;
        },
        {},
      );

      if (Object.keys(variables).length > 0) {
        headers['x-auth-secrets'] = cryptoVault.encrypt(
          JSON.stringify(variables),
        );
      }
    }
  } catch (error) {
    // Silently handle crypto vault creation errors
  }

  return headers;
}
