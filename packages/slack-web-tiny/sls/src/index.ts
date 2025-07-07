import dotenv from 'dotenv';
import { CryptoVault } from '@microfox/crypto-sdk';
import { sdkInit } from './sdkInit.js';
import { APIGatewayEvent } from 'aws-lambda';
import {
  extractArguments,
  populateEnvVars,
  extractFunction,
  executeFunction,
} from './decrypt.js';
import { ApiError, createApiResponse, InternalServerError } from './errors.js';

dotenv.config(); // for any local vars

// Initialize CryptoVault with environment key

export const handler = async (event: APIGatewayEvent): Promise<any> => {
  try {
    // Extract the functionName from the path: /{functionName}
    console.log(
      'event',
      event.pathParameters,
      'headers',
      event.headers,
      'body',
      JSON.parse(event.body),
    );

    // Extract environment variables from the new structure
    populateEnvVars(event);

    // Map functions
    const sdkMap = sdkInit();

    // Extract function arguments
    const args = extractArguments(event);

    // Extract function from the SDK map
    const fn = extractFunction(sdkMap, event);

    // Invoke the function
    const result = await executeFunction(fn, args);

    // Return successful response
    return createApiResponse(200, result);
  } catch (error) {
    console.error('Error in handler:', error);

    // Handle custom API errors
    if (error instanceof ApiError) {
      return createApiResponse(error.statusCode, { error: error.message });
    }

    // Handle unexpected errors
    const internalError = new InternalServerError(
      error instanceof Error ? error.message : String(error),
    );
    return createApiResponse(internalError.statusCode, {
      error: internalError.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};
