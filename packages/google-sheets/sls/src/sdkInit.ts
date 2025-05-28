import { createGoogleSheetsSdk } from '@microfox/google-sheets';

export const sdkInit = (envVars: Record<string, string>): Record<string, Function> => {
    // Validate required environment variables
    const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_ACCESS_TOKEN', 'GOOGLE_REFRESH_TOKEN'];
    for (const envVar of requiredEnvVars) {
        if (!envVars[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }

    // Initialize SDK
    const sdk = createGoogleSheetsSdk({
        clientId: envVars['GOOGLE_CLIENT_ID'],
        clientSecret: envVars['GOOGLE_CLIENT_SECRET'],
        accessToken: envVars['GOOGLE_ACCESS_TOKEN'],
        refreshToken: envVars['GOOGLE_REFRESH_TOKEN'],
    });

    // Map functions
    const sdkMap: Record<string, Function> = {
        validateAccessToken: sdk.validateAccessToken.bind(sdk),
        refreshAccessToken: sdk.refreshAccessToken.bind(sdk),
        getValues: sdk.getValues.bind(sdk),
        updateValues: sdk.updateValues.bind(sdk),
        appendValues: sdk.appendValues.bind(sdk),
        clearValues: sdk.clearValues.bind(sdk),
        batchGetValues: sdk.batchGetValues.bind(sdk),
        batchUpdateValues: sdk.batchUpdateValues.bind(sdk),
        batchClearValues: sdk.batchClearValues.bind(sdk),
        duplicateRowsDetection: sdk.duplicateRowsDetection.bind(sdk),
        sanitizeSheetData: sdk.sanitizeSheetData.bind(sdk),
    };

    return sdkMap;
}