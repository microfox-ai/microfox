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
      sdkMap.imageSearch = sdk.imageSearch.bind(sdk);
      sdkMap.newsSearch = sdk.newsSearch.bind(sdk);
      sdkMap.videoSearch = sdk.videoSearch.bind(sdk);
      sdkMap.webSearch = sdk.webSearch.bind(sdk);
      return sdkMap;
    default:
      // Fallback to createBraveSDK as default
      const defaultSdk = createBraveSDK({
        apiKey: BRAVE_API_KEY,
        ...options,
      });
      const defaultSdkMap: Record<string, Function> = {};
      defaultSdkMap.imageSearch = defaultSdk.imageSearch.bind(defaultSdk);
      defaultSdkMap.newsSearch = defaultSdk.newsSearch.bind(defaultSdk);
      defaultSdkMap.videoSearch = defaultSdk.videoSearch.bind(defaultSdk);
      defaultSdkMap.webSearch = defaultSdk.webSearch.bind(defaultSdk);
      return defaultSdkMap;
  }
};

export { createBraveSDK };