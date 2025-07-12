import { CryptoVault } from '@microfox/crypto-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import {
  ApiError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from './api';
import dotenv from 'dotenv';

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

  async populateEnvs(options: {
    event?: APIGatewayEvent;
    body?: { xAuthSecrets?: string };
    packages?: string[];
    stage?: string;
    specificPackageTemplates?: Record<string, string>;
  }): Promise<void> {
    if (options.event) {
      this.populateEnvVars(options.event);
    }
    if (options.body?.xAuthSecrets) {
      this.populateEnvVars({ xAuthSecrets: options.body.xAuthSecrets });
    }
    if (options.packages) {
      let ptomises = options.packages.map((packageName) =>
        this.fetchEnvVars({
          packageName,
          stage: options.stage ?? process.env.MCIROFOX_STAGE,
        })
      );

      if (options.specificPackageTemplates) {
        ptomises = ptomises.concat(
          Object.entries(options.specificPackageTemplates).map(
            ([packageName, templateId]) =>
              this.fetchEnvVars({
                packageName,
                templateId,
                stage: options.stage ?? process.env.MCIROFOX_STAGE,
              })
          )
        );
      }
      await Promise.all(ptomises);
    }
  }

  populateEnvVars(
    event:
      | APIGatewayEvent
      | { headers: { 'x-auth-secrets': string } }
      | { xAuthSecrets: string }
  ): void {
    const authSecrets =
      (event as any)?.headers?.['x-auth-secrets'] ??
      (event as any)?.xAuthSecrets;

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

  async fetchEnvVars(options: {
    packageName: string;
    templateType?: string;
    templateId?: string;
    stage?: string;
    apiKey?: string;
  }): Promise<string[]> {
    const url = `https://${
      options.stage ?? 'staging'
    }.microfox.app/api/client-secrets/get-template`;

    try {
      console.log(
        'Fetching env vars from',
        process.env.MICROFOX_TEMPLATE_API_KEY
      );
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          MicrofoxTemplateApiKey:
            options.apiKey ?? process.env.MICROFOX_TEMPLATE_API_KEY ?? '',
        },
        body: JSON.stringify({
          packageName: options.packageName,
          templateType: options.templateType ?? 'testing',
          templateId: options.templateId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
          `Failed to fetch template: ${response.statusText} - ${errorText}`,
          response.status
        );
      }

      const templateSecrets = await response.json();
      const variables: Record<string, string> = {};

      templateSecrets.forEach((secret: any) => {
        const _variables = secret.variables;
        if (Array.isArray(_variables)) {
          for (const variable of _variables) {
            variables[variable.key] = variable.value;
          }
        }
      });

      dotenv.populate(process.env as any, variables);

      return Object.keys(variables);
    } catch (error) {
      console.error(
        'Error fetching/populating environment variables from template:',
        error
      );
      if (error instanceof ApiError) {
        throw error;
      }
      throw new InternalServerError(
        'Failed to fetch and populate environment variables from template'
      );
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

  extractConstructor(event: APIGatewayEvent): string {
    // Parse the request body
    let requestBody: any;
    try {
      requestBody = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      throw new BadRequestError('Invalid JSON in request body');
    }

    return requestBody?.body?.constructor ?? requestBody?.constructor;
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
