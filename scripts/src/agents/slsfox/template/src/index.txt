import dotenv from 'dotenv';
import { sdkInit } from './sdkInit.js';
import { APIGatewayEvent } from 'aws-lambda';
import {
  ToolParse,
  createApiResponse,
  ApiError,
  InternalServerError,
} from '@microfox/tool-core';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config(); // for any local vars

const toolHandler = new ToolParse({
  encryptionKey: process.env.ENCRYPTION_KEY,
});

export const handler = async (event: APIGatewayEvent): Promise<any> => {
  if (event.path === '/docs.json' && event.httpMethod === 'GET') {
    try {
      const openapiPath = path.resolve(__dirname, 'openapi.json');
      const openapiSpec = fs.readFileSync(openapiPath, 'utf-8');
      return createApiResponse(200, JSON.parse(openapiSpec));
    } catch (error) {
      console.error('Error reading openapi.json:', error);
      const internalError = new InternalServerError('Could not load API specification.');
      return createApiResponse(internalError.statusCode, {
        error: internalError.message,
      });
    }
  }

  try {
    // Extract environment variables from the new structure
    toolHandler.populateEnvVars(event);

    const constructorName = toolHandler.extractConstructor(event);

    // Map functions
    const sdkMap = sdkInit({
      constructorName,
      ...process.env,
    });

    // Extract function arguments
    const args = toolHandler.extractArguments(event);

    // Extract function from the SDK map
    const fn = toolHandler.extractFunction(sdkMap, event);

    // Invoke the function
    const result = await toolHandler.executeFunction(fn, args);

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
