import { createBraveSDK } from '@microfox/brave';

interface SDKConfig {
  constructorName: string;
  [key: string]: any;
}

export const sdkInit = (config: SDKConfig) => {
  const { constructorName, BRAVE_API_KEY, ...options } = config;

  if (!BRAVE_API_KEY) {
    throw new Error('BRAVE_API_KEY is required');
  }

  switch (constructorName) {
    case 'createBraveSDK':
      return createBraveSDK({
        apiKey: BRAVE_API_KEY,
        ...options,
      });
    default:
      throw new Error(`Constructor "${constructorName}" is not supported.`);
  }
};

export { createBraveSDK };
