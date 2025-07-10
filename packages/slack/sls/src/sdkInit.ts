import { WebClient, MicrofoxSlackClient } from '@microfox/slack';

interface SDKConfig {
  constructorName: string;
  [key: string]: any;
}

export const sdkInit = (config: SDKConfig): Record<string, Function> => {
  const { constructorName, SLACK_BOT_TOKEN, ...options } = config;

  if (!SLACK_BOT_TOKEN) {
    throw new Error('SLACK_BOT_TOKEN is required');
  }

  switch (constructorName) {
    case 'WebClient':
      const webClient = new WebClient(SLACK_BOT_TOKEN, options);
      const webClientMap: Record<string, Function> = {};
      webClientMap['chat.postMessage'] = webClient.chat.postMessage.bind(webClient.chat);
      webClientMap['chat.update'] = webClient.chat.update.bind(webClient.chat);
      webClientMap['conversations.history'] = webClient.conversations.history.bind(webClient.conversations);
      webClientMap['conversations.join'] = webClient.conversations.join.bind(webClient.conversations);
      webClientMap['conversations.list'] = webClient.conversations.list.bind(webClient.conversations);
      webClientMap['reactions.add'] = webClient.reactions.add.bind(webClient.reactions);
      webClientMap['users.info'] = webClient.users.info.bind(webClient.users);
      webClientMap['users.list'] = webClient.users.list.bind(webClient.users);
      webClientMap['users.lookupByEmail'] = webClient.users.lookupByEmail.bind(webClient.users);
      webClientMap['views.open'] = webClient.views.open.bind(webClient.views);
      return webClientMap;

    case 'MicrofoxSlackClient':
      const microfoxClient = new MicrofoxSlackClient(SLACK_BOT_TOKEN, options);
      const microfoxClientMap: Record<string, Function> = {};
      microfoxClientMap.addUserToChannel = microfoxClient.addUserToChannel.bind(microfoxClient);
      microfoxClientMap.createChannel = microfoxClient.createChannel.bind(microfoxClient);
      microfoxClientMap.getChannelConversationInfo = microfoxClient.getChannelConversationInfo.bind(microfoxClient);
      microfoxClientMap.getFileInfo = microfoxClient.getFileInfo.bind(microfoxClient);
      microfoxClientMap.getUserInfo = microfoxClient.getUserInfo.bind(microfoxClient);
      microfoxClientMap.listChannels = microfoxClient.listChannels.bind(microfoxClient);
      microfoxClientMap.listChannelUsers = microfoxClient.listChannelUsers.bind(microfoxClient);
      microfoxClientMap.listUsers = microfoxClient.listUsers.bind(microfoxClient);
      microfoxClientMap.messageChannel = microfoxClient.messageChannel.bind(microfoxClient);
      microfoxClientMap.messageUser = microfoxClient.messageUser.bind(microfoxClient);
      microfoxClientMap.reactMessage = microfoxClient.reactMessage.bind(microfoxClient);
      microfoxClientMap.removeUserFromChannel = microfoxClient.removeUserFromChannel.bind(microfoxClient);
      microfoxClientMap.replyMessage = microfoxClient.replyMessage.bind(microfoxClient);
      microfoxClientMap.searchChannel = microfoxClient.searchChannel.bind(microfoxClient);
      microfoxClientMap.searchUser = microfoxClient.searchUser.bind(microfoxClient);
      microfoxClientMap.sendFile = microfoxClient.sendFile.bind(microfoxClient);
      microfoxClientMap.setReminder = microfoxClient.setReminder.bind(microfoxClient);
      return microfoxClientMap;

    default:
      // Fallback to WebClient as default
      const defaultClient = new WebClient(SLACK_BOT_TOKEN, options);
      const defaultClientMap: Record<string, Function> = {};
      defaultClientMap['chat.postMessage'] = defaultClient.chat.postMessage.bind(defaultClient.chat);
      defaultClientMap['chat.update'] = defaultClient.chat.update.bind(defaultClient.chat);
      defaultClientMap['conversations.history'] = defaultClient.conversations.history.bind(defaultClient.conversations);
      defaultClientMap['conversations.join'] = defaultClient.conversations.join.bind(defaultClient.conversations);
      defaultClientMap['conversations.list'] = defaultClient.conversations.list.bind(defaultClient.conversations);
      defaultClientMap['reactions.add'] = defaultClient.reactions.add.bind(defaultClient.reactions);
      defaultClientMap['users.info'] = defaultClient.users.info.bind(defaultClient.users);
      defaultClientMap['users.list'] = defaultClient.users.list.bind(defaultClient.users);
      defaultClientMap['users.lookupByEmail'] = defaultClient.users.lookupByEmail.bind(defaultClient.users);
      defaultClientMap['views.open'] = defaultClient.views.open.bind(defaultClient.views);
      return defaultClientMap;
  }
};

export { WebClient, MicrofoxSlackClient };