import {
  MicrofoxSlackClient,
} from '@microfox/slack';

interface SDKConfig {
  constructorName: string;
  [key: string]: any;
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

  switch (constructorName) {
    case 'MicrofoxSlackClient':
      const microfoxClient = new MicrofoxSlackClient(
        SLACK_BOT_TOKEN,
      );
      const microfoxClientMap: Record<string, Function> = {};
      microfoxClientMap.addUserToChannel =
        microfoxClient.addUserToChannel.bind(microfoxClient);
      microfoxClientMap.createChannel =
        microfoxClient.createChannel.bind(microfoxClient);
      microfoxClientMap.getChannelConversationInfo =
        microfoxClient.getChannelConversationInfo.bind(microfoxClient);
      microfoxClientMap.getConversationHistory =
        microfoxClient.getConversationHistory.bind(microfoxClient);
      microfoxClientMap.getFileInfo =
        microfoxClient.getFileInfo.bind(microfoxClient);
      microfoxClientMap.getUserInfo =
        microfoxClient.getUserInfo.bind(microfoxClient);
      microfoxClientMap.joinChannel =
        microfoxClient.joinChannel.bind(microfoxClient);
      microfoxClientMap.listChannels =
        microfoxClient.listChannels.bind(microfoxClient);
      microfoxClientMap.listChannelUsers =
        microfoxClient.listChannelUsers.bind(microfoxClient);
      microfoxClientMap.listActiveUsers =
        microfoxClient.listActiveUsers.bind(microfoxClient);
      microfoxClientMap.messageChannel =
        microfoxClient.messageChannel.bind(microfoxClient);
      microfoxClientMap.messageUser =
        microfoxClient.messageUser.bind(microfoxClient);
      microfoxClientMap.reactMessage =
        microfoxClient.reactMessage.bind(microfoxClient);
      microfoxClientMap.removeUserFromChannel =
        microfoxClient.removeUserFromChannel.bind(microfoxClient);
      microfoxClientMap.replyMessage =
        microfoxClient.replyMessage.bind(microfoxClient);
      microfoxClientMap.searchUserByEmail =
        microfoxClient.searchUserByEmail.bind(microfoxClient);
      microfoxClientMap.setReminder =
        microfoxClient.setReminder.bind(microfoxClient);
      microfoxClientMap.uploadFile =
        microfoxClient.uploadFile.bind(microfoxClient);
      return microfoxClientMap;

    default:
      // Fallback to WebClient as default
      const defaultClient = new MicrofoxSlackClient(SLACK_BOT_TOKEN);
      const defaultClientMap: Record<string, Function> = {};
      defaultClientMap.addUserToChannel =
        defaultClient.addUserToChannel.bind(defaultClient);
      defaultClientMap.createChannel =
        defaultClient.createChannel.bind(defaultClient);
      defaultClientMap.getChannelConversationInfo =
        defaultClient.getChannelConversationInfo.bind(defaultClient);
      defaultClientMap.getConversationHistory =
        defaultClient.getConversationHistory.bind(defaultClient);
      defaultClientMap.getFileInfo =
        defaultClient.getFileInfo.bind(defaultClient);
      defaultClientMap.getUserInfo =
        defaultClient.getUserInfo.bind(defaultClient);
      defaultClientMap.joinChannel =
        defaultClient.joinChannel.bind(defaultClient);
      defaultClientMap.listChannels =
        defaultClient.listChannels.bind(defaultClient);
      defaultClientMap.listChannelUsers =
        defaultClient.listChannelUsers.bind(defaultClient);
      defaultClientMap.listActiveUsers =
        defaultClient.listActiveUsers.bind(defaultClient);
      defaultClientMap.messageChannel =
        defaultClient.messageChannel.bind(defaultClient);
      defaultClientMap.messageUser =
        defaultClient.messageUser.bind(defaultClient);
      defaultClientMap.reactMessage =
        defaultClient.reactMessage.bind(defaultClient);
      defaultClientMap.removeUserFromChannel =
        defaultClient.removeUserFromChannel.bind(defaultClient);
      defaultClientMap.replyMessage =
        defaultClient.replyMessage.bind(defaultClient);
      defaultClientMap.searchUserByEmail =
        defaultClient.searchUserByEmail.bind(defaultClient);
      defaultClientMap.setReminder =
        defaultClient.setReminder.bind(defaultClient);
      defaultClientMap.uploadFile =
        defaultClient.uploadFile.bind(defaultClient);
      return defaultClientMap;
  }
};

export { MicrofoxSlackClient };
