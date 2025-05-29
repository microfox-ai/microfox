import { createXSDK } from '@microfox/twitter';

export const sdkInit = (envVars: Record<string, string>): Record<string, Function> => {
    // Environment variable validation
    if (!envVars.X_API_KEY) {
        throw new Error('X_API_KEY is required');
    }
    if (!envVars.X_API_SECRET) {
        throw new Error('X_API_SECRET is required');
    }
    if (!envVars.X_ACCESS_TOKEN) {
        throw new Error('X_ACCESS_TOKEN is required');
    }
    if (!envVars.X_ACCESS_SECRET) {
        throw new Error('X_ACCESS_SECRET is required');
    }

    // Initialize SDK
    const sdk = createXSDK({
        apiKey: envVars.X_API_KEY,
        apiSecret: envVars.X_API_SECRET,
        accessToken: envVars.X_ACCESS_TOKEN,
        accessSecret: envVars.X_ACCESS_SECRET,
    });

    // Map functions
    const sdkMap: Record<string, Function> = {
        create: sdk.create.bind(sdk),
        get: sdk.get.bind(sdk),
        getMultiple: sdk.getMultiple.bind(sdk),
        delete: sdk.delete.bind(sdk),
        getByUsername: sdk.getByUsername.bind(sdk),
        getByUsernames: sdk.getByUsernames.bind(sdk),
        getById: sdk.getById.bind(sdk),
        getByIds: sdk.getByIds.bind(sdk),
        getMe: sdk.getMe.bind(sdk),
        upload: sdk.upload.bind(sdk),
        generateOAuthHeader: sdk.generateOAuthHeader.bind(sdk),
    };

    return sdkMap;
}