import { APIGatewayEvent } from 'aws-lambda';
import { CryptoVault } from '@microfox/crypto-sdk';
import dotenv from 'dotenv';
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from './errors.js';

const RAW_KEY = process.env.ENCRYPTION_KEY;
if (!RAW_KEY) {
  throw new Error('Missing ENCRYPTION_KEY in environment');
}

const cryptoVault = new CryptoVault({
  key: RAW_KEY,
  keyFormat: 'base64',
  encryptionAlgo: 'aes-256-gcm',
  hashAlgo: 'sha256',
  outputEncoding: 'base64url',
});

export const populateEnvVars = (event: APIGatewayEvent) => {
  const authSecrets = event.headers['x-auth-secrets'];
  if (!authSecrets) {
    throw new BadRequestError('Missing x-auth-secrets in headers');
  }
  try {
    const authVariablesStri = cryptoVault.decrypt(authSecrets);
    const authVariables = JSON.parse(authVariablesStri);
    dotenv.populate(process.env, authVariables);
  } catch (decryptionError) {
    console.error('Error decrypting environment variables:', decryptionError);
    throw new BadRequestError('Failed to decrypt environment variables');
  }
};

export const extractArguments = (event: APIGatewayEvent) => {
  // Parse the request body
  let requestBody: any;
  try {
    requestBody = event.body ? JSON.parse(event.body) : {};
  } catch (parseError) {
    console.error('Error parsing request body:', parseError);
    throw new BadRequestError('Invalid JSON in request body');
  }
  let args: any[] = [];
  try {
    const bodyArgs = requestBody?.body?.arguments ?? requestBody?.arguments;
    if (bodyArgs) {
      args = Array.isArray(bodyArgs) ? bodyArgs : [bodyArgs];
    }
  } catch (argsError) {
    console.error('Error parsing function arguments:', argsError);
    throw new BadRequestError('Invalid function arguments');
  }
  return args;
};

export const extractFunction = (
  sdkMap: Record<string, any>,
  event: APIGatewayEvent,
  path?: string = 'functionName',
) => {
  const segments = event.path.split('/').filter(Boolean);
  const functionName = event.pathParameters?.[path ?? 'functionName'];
  if (!functionName) {
    throw new BadRequestError(
      `Missing Path parameters for path matching ${path}`,
    );
  }

  const fn = sdkMap[functionName];
  if (!fn) {
    throw new NotFoundError(`Function '${functionName}' not found`);
  }

  return fn;
};

export const executeFunction = async (fn: any, args: any[]) => {
  try {
    const result = await fn(...args);
    return result;
  } catch (functionError) {
    console.error('Error executing SDK function:', functionError, args);
    throw new InternalServerError(
      functionError instanceof Error
        ? functionError.message
        : String(functionError),
    );
  }
};
