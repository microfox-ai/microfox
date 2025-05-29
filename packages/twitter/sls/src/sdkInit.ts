import { createXSDK } from '@microfox/twitter';

export const sdkInit = (envVars: Record<string, string>): Record<string, Function> => {
    // Environment variable validation
    const requiredEnvVars = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_SECRET'];
    for (const envVar of requiredEnvVars) {
        if (!envVars[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }

    // Initialize SDK
    const sdk = createXSDK({
        apiKey: envVars['X_API_KEY'],
        apiSecret: envVars['X_API_SECRET'],
        accessToken: envVars['X_ACCESS_TOKEN'],
        accessSecret: envVars['X_ACCESS_SECRET'],
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