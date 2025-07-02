import { WebClient, MicrofoxSlackClient } from '@microfox/slack';

interface SDKConfig {
  constructorName: string;
  SLACK_BOT_TOKEN: string;
  [key: string]: any;
}

export const sdkInit = (config: SDKConfig): WebClient | MicrofoxSlackClient => {
  const { constructorName, SLACK_BOT_TOKEN, ...options } = config;

  if (!SLACK_BOT_TOKEN) {
    throw new Error('SLACK_BOT_TOKEN is required');
  }

  switch (constructorName) {
    case 'WebClient':
      return new WebClient(SLACK_BOT_TOKEN, options);
    case 'MicrofoxSlackClient':
      return new MicrofoxSlackClient(SLACK_BOT_TOKEN, options);
    default:
      throw new Error(`Constructor "${constructorName}" is not supported.`);
  }
};

export { WebClient, MicrofoxSlackClient };