import { createBraveSDK } from '@microfox/brave';

interface SDKConfig {
  constructorName: string;
  [key: string]: any;
}

export const sdkInit = (config: SDKConfig): Record<string, Function> => {
  const { constructorName, BRAVE_API_KEY, ...options } = config;

  if (!BRAVE_API_KEY) {
    throw new Error('BRAVE_API_KEY is required');
  }

  switch (constructorName) {
    case 'createBraveSDK':
      const sdk = createBraveSDK({
        apiKey: BRAVE_API_KEY,
        ...options,
      });
      const sdkMap: Record<string, Function> = {};
      sdkMap.webSearch = sdk.webSearch.bind(sdk);
      sdkMap.imageSearch = sdk.imageSearch.bind(sdk);
      sdkMap.newsSearch = sdk.newsSearch.bind(sdk);
      return sdkMap;
    default:
      throw new Error(`Constructor "${constructorName}" is not supported.`);
  }
};

export { createBraveSDK };
