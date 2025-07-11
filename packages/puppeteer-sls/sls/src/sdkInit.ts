import { PuppeteerSLS } from '@microfox/puppeteer-sls';

interface SDKConfig {
  constructorName: string;
  [key: string]: any;
}

/**
 * @description Initialize the SDK for the PuppeteerSLS class
 * @param config - The configuration for the SDK
 * @returns A map of functions for the SDK
 */
export const sdkInit = (config: SDKConfig): Record<string, Function> => {
  const { constructorName, ...options } = config;

  switch (constructorName) {
    case 'PuppeteerSLS':
      const sdk = PuppeteerSLS;
      const sdkMap: Record<string, Function> = {};
      sdkMap.extractImagesFromURL = sdk.extractImagesFromURL.bind(sdk);
      sdkMap.extractLinksFromUrl = sdk.extractLinksFromUrl.bind(sdk);
      sdkMap.extractWebpage = sdk.extractWebpage.bind(sdk);
      sdkMap.openPage = sdk.openPage.bind(sdk);
      sdkMap.takeSnapShot = sdk.takeSnapShot.bind(sdk);
      return sdkMap;
    default:
      // Fallback to PuppeteerSLS as the default case
      const defaultSdk = PuppeteerSLS;
      const defaultSdkMap: Record<string, Function> = {};
      defaultSdkMap.extractImagesFromURL =
        defaultSdk.extractImagesFromURL.bind(defaultSdk);
      defaultSdkMap.extractLinksFromUrl =
        defaultSdk.extractLinksFromUrl.bind(defaultSdk);
      defaultSdkMap.extractWebpage = defaultSdk.extractWebpage.bind(defaultSdk);
      defaultSdkMap.openPage = defaultSdk.openPage.bind(defaultSdk);
      defaultSdkMap.takeSnapShot = defaultSdk.takeSnapShot.bind(defaultSdk);
      return defaultSdkMap;
  }
};

export { PuppeteerSLS };
