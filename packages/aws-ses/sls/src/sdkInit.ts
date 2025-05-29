import { createSESSdk } from '@microfox/aws-ses';

export const sdkInit = (envVars: Record<string, string>): Record<string, Function> => {
    // Environment variable validation
    if (!envVars['AWS_SES_ACCESS_KEY_ID']) {
        throw new Error('AWS_SES_ACCESS_KEY_ID is required');
    }
    if (!envVars['AWS_SES_SECRET_ACCESS_KEY']) {
        throw new Error('AWS_SES_SECRET_ACCESS_KEY is required');
    }
    if (!envVars['AWS_SES_REGION']) {
        throw new Error('AWS_SES_REGION is required');
    }

    // Initialize SDK
    const sdk = createSESSdk({
        accessKeyId: envVars['AWS_SES_ACCESS_KEY_ID'],
        secretAccessKey: envVars['AWS_SES_SECRET_ACCESS_KEY'],
        region: envVars['AWS_SES_REGION']
    });

    // Map functions
    const sdkMap: Record<string, Function> = {
        sendEmail: sdk.sendEmail.bind(sdk),
        sendBulkEmails: sdk.sendBulkEmails.bind(sdk)
    };

    return sdkMap;
}