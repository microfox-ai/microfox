import dotenv from 'dotenv';
import { CryptoVault } from '@microfox/crypto-sdk';
import { sdkInit } from './sdkInit.js';

dotenv.config(); // for any local vars

// Initialize CryptoVault with environment key
const RAW_KEY = process.env.ENCRYPTION_KEY;
if (!RAW_KEY) {
  throw new Error('Missing ENCRYPTION_KEY in environment');
}

const cryptoVault = new CryptoVault({
  key: RAW_KEY,
  keyFormat: 'base64',
  encryptionAlgo: 'aes-256-gcm',
  hashAlgo: 'sha256',
  outputEncoding: 'base64url'
});

export const handler = async (event: any): Promise<any> => {
  try {
    // Extract the functionName from the path: /{functionName}
    console.log("event", event);
    const segments = event.path.split("/").filter(Boolean);
    const functionName = segments[segments.length - 1]!.split("?")[0];
    console.log("functionName", functionName);

    // Parse the request body
    let requestBody: any;
    try {
      requestBody = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    // Extract environment variables from the new structure
    const authVariables = requestBody?.body?.auth?.variables;
    if (!authVariables || !Array.isArray(authVariables)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: 'Missing or invalid auth.variables in request body' }),
      };
    }

    // Decrypt environment variables
    const envVars: Record<string, string> = {};
    try {
      for (const variable of authVariables) {
        if (!variable.key || !variable.value) {
          console.warn("Skipping invalid variable:", variable);
          continue;
        }

        // Decrypt the value
        const decryptedValue = cryptoVault.decrypt(variable.value);
        envVars[variable.key] = decryptedValue;
      }
    } catch (decryptionError) {
      console.error("Error decrypting environment variables:", decryptionError);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to decrypt environment variables" }),
      };
    }

    // Map functions
    const sdkMap = sdkInit(envVars);

    const fn = sdkMap[functionName];
    if (!fn) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Function '${functionName}' not found` }),
      };
    }

    // Extract function arguments
    let args: any[] = [];
    try {
      const bodyArgs = requestBody?.body?.arguments;
      if (bodyArgs) {
        args = Array.isArray(bodyArgs) ? bodyArgs : [bodyArgs];
      }
    } catch (argsError) {
      console.error("Error parsing function arguments:", argsError);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid function arguments" }),
      };
    }

    // Invoke the function
    try {
      const result = await fn(...args);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      };
    } catch (functionError) {
      console.error("Error executing SDK function:", functionError);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: functionError instanceof Error ? functionError.message : String(functionError),
        }),
      };
    }

  } catch (generalError) {
    console.error("Unexpected error in handler:", generalError);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal server error",
        details: generalError instanceof Error ? generalError.message : String(generalError),
      }),
    };
  }
};
