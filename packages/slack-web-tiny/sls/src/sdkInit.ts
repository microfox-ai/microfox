import { createSlackSDK } from '@microfox/slack-web-tiny';

export const sdkInit = (): Record<string, Function> => {
  // Environment variable validation
  if (!process.env['SLACK_BOT_TOKEN'] && !process.env['SLACK_ACCESS_TOKEN']) {
    throw new Error(
      'SLACK_BOT_TOKEN is required but not provided in the environment variables.',
    );
  }

  // Initialize SDK with bot token
  const sdk = createSlackSDK({
    botToken:
      process.env.SLACK_BOT_TOKEN || process.env.SLACK_ACCESS_TOKEN || '',
    authType: 'header', // Default to header authentication
  });

  // Map functions
  const sdkMap: Record<string, Function> = {
    sendMessage: sdk.sendMessage.bind(sdk),
    updateMessage: sdk.updateMessage.bind(sdk),
    uploadFile: sdk.uploadFile.bind(sdk),
  };

  return sdkMap;
};
