import { APIGatewayEvent } from 'aws-lambda';
import { CryptoVault } from '@microfox/crypto-sdk';
import dotenv from 'dotenv';

export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = this.constructor.name;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
  }
}

export interface ToolParseOptions {
  encryptionKey?: string;
  keyFormat?: 'base64' | 'hex' | 'utf8';
  encryptionAlgo?: 'aes-256-gcm' | 'aes-256-cbc';
  hashAlgo?: 'sha256' | 'sha512';
  outputEncoding?: 'base64url' | 'base64' | 'hex';
}

export class ToolParse {
  private cryptoVault: CryptoVault | null = null;
  private options: ToolParseOptions;

  constructor(options: ToolParseOptions = {}) {
    this.options = {
      encryptionKey: process.env.ENCRYPTION_KEY,
      keyFormat: 'base64',
      encryptionAlgo: 'aes-256-gcm',
      hashAlgo: 'sha256',
      outputEncoding: 'base64url',
      ...options,
    };

    if (this.options.encryptionKey) {
      this.cryptoVault = new CryptoVault({
        key: this.options.encryptionKey,
        keyFormat: this.options.keyFormat!,
        encryptionAlgo: this.options.encryptionAlgo!,
        hashAlgo: this.options.hashAlgo!,
        outputEncoding: this.options.outputEncoding!,
      });
    }
  }

  populateEnvVars(event: APIGatewayEvent): void {
    const authSecrets = event.headers['x-auth-secrets'];
    if (!authSecrets) {
      throw new BadRequestError('Missing x-auth-secrets in headers');
    }

    if (!this.cryptoVault) {
      throw new BadRequestError(
        'CryptoVault not initialized. Please provide encryptionKey in options.'
      );
    }

    try {
      const authVariablesStri = this.cryptoVault.decrypt(authSecrets);
      const authVariables = JSON.parse(authVariablesStri);
      dotenv.populate(process.env as any, authVariables);
    } catch (decryptionError) {
      console.error('Error decrypting environment variables:', decryptionError);
      throw new BadRequestError('Failed to decrypt environment variables');
    }
  }

  extractArguments(event: APIGatewayEvent): any[] {
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
  }

  extractFunction(
    sdkMap: Record<string, any>,
    event: APIGatewayEvent,
    path: string = 'functionName'
  ): any {
    const functionName = event.pathParameters?.[path];
    if (!functionName) {
      throw new BadRequestError(
        `Missing Path parameters for path matching ${path}`
      );
    }

    const fn = sdkMap[functionName];
    if (!fn) {
      throw new NotFoundError(`Function '${functionName}' not found`);
    }

    return fn;
  }

  async executeFunction(fn: any, args: any[]): Promise<any> {
    try {
      const result = await fn(...args);
      return result;
    } catch (functionError) {
      console.error('Error executing SDK function:', functionError, args);
      throw new InternalServerError(
        functionError instanceof Error
          ? functionError.message
          : String(functionError)
      );
    }
  }
}

export const createApiResponse = (statusCode: number, body: any) => {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};
