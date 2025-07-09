// Example usage of ToolParse
import { ToolParse, createApiResponse } from '../index.js';

// Example SDK map
const sdkMap = {
  getUser: async (id: string) => ({ id, name: 'John Doe' }),
  createUser: async (name: string, email: string) => ({
    id: '123',
    name,
    email,
  }),
};

// Example handler function
export const exampleHandler = async (event: any) => {
  try {
    const handler = new ToolParse({
      encryptionKey: process.env.ENCRYPTION_KEY,
    });

    // Populate environment variables from encrypted headers
    handler.populateEnvVars(event);

    // Extract arguments from request body
    const args = handler.extractArguments(event);

    // Extract function from SDK map
    const fn = handler.extractFunction(sdkMap, event);

    // Execute the function
    const result = await handler.executeFunction(fn, args);

    return createApiResponse(200, { success: true, data: result });
  } catch (error: any) {
    return createApiResponse(error.statusCode || 500, {
      success: false,
      error: error.message,
    });
  }
};
