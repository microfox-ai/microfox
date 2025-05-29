import { createSlackSDK } from '@microfox/slack-web-tiny';

export const sdkInit = (envVars: Record<string, string>): Record<string, Function> => {
    // Environment variable validation
    if (!envVars['SLACK_BOT_TOKEN']) {
        throw new Error('SLACK_BOT_TOKEN is required but not provided in the environment variables. Please set the SLACK_BOT_TOKEN environment variable.');
    }

    // Initialize SDK
    const sdk = createSlackSDK({
        botToken: envVars['SLACK_BOT_TOKEN'],
        authType: 'header', // Default to header authentication
    });

    // Map functions
    const sdkMap: Record<string, Function> = {
        sendMessage: sdk.sendMessage.bind(sdk),
        updateMessage: sdk.updateMessage.bind(sdk),
        uploadFile: sdk.uploadFile.bind(sdk),
    };

    return sdkMap;
}