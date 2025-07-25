import { MicrofoxSlackClient } from '@microfox/slack';

interface SDKConfig {
  constructorName: string;
  [key: string]: any;
}

/**
 * Dynamically binds all available methods from a client instance
 */
function bindAllAvailableMethods(client: any): Record<string, Function> {
  const clientMap: Record<string, Function> = {};

  // Get all method names from the client instance
  const prototype = Object.getPrototypeOf(client);
  const methodNames = Object.getOwnPropertyNames(prototype).filter(name => {
    // Filter out constructor and non-function properties
    if (name === 'constructor') return false;

    try {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
      return descriptor && typeof descriptor.value === 'function';
    } catch {
      return false;
    }
  });

  // Bind each available method
  methodNames.forEach(methodName => {
    try {
      const method = client[methodName];
      if (typeof method === 'function') {
        clientMap[methodName] = method.bind(client);
      }
    } catch (error) {
      // Skip methods that can't be accessed or bound
      console.warn(`Could not bind method ${methodName}:`, error);
    }
  });

  return clientMap;
}

/**
 * Creates a client instance based on constructor name
 */
function createClientInstance(constructorName: string, token: string) {
  switch (constructorName) {
    case 'MicrofoxSlackClient':
      return new MicrofoxSlackClient(token);

    // Add other client types here as needed
    // case 'AnotherSlackClient':
    //   return new AnotherSlackClient(token);

    default:
      // Default fallback to MicrofoxSlackClient
      return new MicrofoxSlackClient(token);
  }
}

export const sdkInit = (config: SDKConfig): Record<string, Function> => {
  const { constructorName } = config;

  const SLACK_BOT_TOKEN =
    process.env.SLACK_BOT_TOKEN || process.env.SLACK_ACCESS_TOKEN;

  if (!SLACK_BOT_TOKEN) {
    throw new Error(
      'SLACK_BOT_TOKEN is required but not provided in the environment variables.',
    );
  }

  // Create the appropriate client instance
  const client = createClientInstance(constructorName, SLACK_BOT_TOKEN);

  // Dynamically bind all available methods from the client
  return {
    listChannels: client.getChannelsIds.bind(client),
    listChannelInfos: client.getChannels.bind(client),
    setUserReminder: client.setReminder.bind(client),
    messageMultipleUsers: client.messageUsers.bind(client),
    listActiveUsers: client.getActiveUsersIds.bind(client),
    listActiveUserInfos: client.getActiveUsers.bind(client),
    messageMultipleChannels: client.messageChannels.bind(client),
    ...bindAllAvailableMethods(client),
  };
};

export { MicrofoxSlackClient };
