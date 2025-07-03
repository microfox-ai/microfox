import { BraveSDK, createBraveSDK } from '@microfox/brave';

interface SDKConfig {
  constructorName: string;
  BRAVE_API_KEY: string;
  BRAVE_SECRET_TEMPLATE_TYPE: string;
  [key: string]: any;
}

export const sdkInit = (config: SDKConfig): BraveSDK => {
  const { constructorName, BRAVE_API_KEY, BRAVE_SECRET_TEMPLATE_TYPE, ...options } = config;

  if (!BRAVE_API_KEY) {
    throw new Error('BRAVE_API_KEY is required');
  }

  if (!BRAVE_SECRET_TEMPLATE_TYPE) {
    throw new Error('BRAVE_SECRET_TEMPLATE_TYPE is required');
  }

  switch (constructorName) {
    case 'createBraveSDK':
      return createBraveSDK({
        apiKey: BRAVE_API_KEY,
        ...options
      });
    default:
      throw new Error(`Constructor "${constructorName}" is not supported.`);
  }
};

export { BraveSDK, createBraveSDK };