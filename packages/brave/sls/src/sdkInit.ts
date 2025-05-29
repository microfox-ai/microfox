import { createBraveSDK } from '@microfox/brave';

export const sdkInit = (envVars: Record<string, string>): Record<string, Function> => {
    // Environment variable validation
    if (!envVars['BRAVE_API_KEY']) {
        throw new Error('BRAVE_API_KEY is required but not provided in the environment variables.');
    }

    // Initialize SDK
    const sdk = createBraveSDK({
        apiKey: envVars['BRAVE_API_KEY'],
    });

    // Map functions
    const sdkMap: Record<string, Function> = {
        request: sdk.request.bind(sdk),
        webSearch: sdk.webSearch.bind(sdk),
        localPoiSearch: sdk.localPoiSearch.bind(sdk),
        localDescriptionsSearch: sdk.localDescriptionsSearch.bind(sdk),
        summarizerSearch: sdk.summarizerSearch.bind(sdk),
        imageSearch: sdk.imageSearch.bind(sdk),
        videoSearch: sdk.videoSearch.bind(sdk),
        newsSearch: sdk.newsSearch.bind(sdk),
        suggestSearch: sdk.suggestSearch.bind(sdk),
        spellcheckSearch: sdk.spellcheckSearch.bind(sdk),
    };

    return sdkMap;
}