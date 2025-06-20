import {
  WebClient,
  WebClientOptions,
  ChatPostMessageResponse,
  ConversationsCreateResponse,
  ConversationsInviteResponse,
  ConversationsKickResponse,
  FilesUploadResponse,
  ReactionsAddResponse,
  RemindersAddResponse,
} from '@slack/web-api';
import { Buffer } from 'buffer';

export class MicrofoxSlackClient {
  private web: WebClient;

  constructor(token: string, options?: WebClientOptions) {
    this.web = new WebClient(token, options);
  }

  /**
   * Lists all public and private channels in a workspace.
   */
  async listChannels() {
    const result = await this.web.conversations.list({
      types: 'public_channel,private_channel',
    });
    return result.channels;
  }

  /**
   * Fetches information about a conversation.
   * @param channelId Conversation ID to fetch information for.
   */
  async getChannelConversationInfo(channelId: string) {
    const result = await this.web.conversations.info({
      channel: channelId,
    });
    return result.channel;
  }

  /**
   * Lists all users in a workspace.
   */
  async listUsers() {
    const result = await this.web.users.list({
      limit: 1000,
    });
    return result.members;
  }

  /**
   * Lists all users in a channel.
   * @param channelId Channel ID to get members of.
   */
  async listChannelUsers(channelId: string) {
    const result = await this.web.conversations.members({
      channel: channelId,
    });
    return result.members;
  }

  /**
   * Finds a user by their email address.
   * @param email The email address of the user to find.
   */
  async searchUser(email: string) {
    const result = await this.web.users.lookupByEmail({ email });
    return result.user;
  }

  /**
   * Finds a channel by its name. This is case-insensitive.
   * @param name The name of the channel to find.
   */
  async searchChannel(name: string) {
    const channels = await this.listChannels();
    return channels?.find((c) => c.name?.toLowerCase() === name.toLowerCase());
  }

  /**
   * Sends a direct message to a user.
   * @param userId The ID of the user to message.
   * @param text The text of the message to send.
   */
  async messageUser(
    userId: string,
    text: string
  ): Promise<ChatPostMessageResponse> {
    const im = await this.web.conversations.open({ users: userId });
    if (im.ok && im.channel?.id) {
      return this.web.chat.postMessage({
        channel: im.channel.id,
        text: text,
      });
    }
    throw new Error(`Could not open DM with user ${userId}`);
  }

  /**
   * Sends a message to a channel.
   * @param channelId The ID of the channel to message.
   * @param text The text of the message to send.
   */
  async messageChannel(
    channelId: string,
    text: string
  ): Promise<ChatPostMessageResponse> {
    return this.web.chat.postMessage({
      channel: channelId,
      text: text,
    });
  }

  /**
   * Sets a reminder for a user.
   * @param userId The ID of the user to set a reminder for.
   * @param text The text of the reminder.
   * @param time A string describing when the reminder should fire (e.g., "in 5 minutes" or a Unix timestamp).
   */
  async setReminder(
    userId: string,
    text: string,
    time: string
  ): Promise<RemindersAddResponse> {
    return this.web.reminders.add({
      user: userId,
      text: text,
      time: time,
    });
  }

  /**
   * Creates a new channel.
   * @param name The name of the channel to create.
   * @param isPrivate Whether the channel should be private. Defaults to false.
   */
  async createChannel(
    name: string,
    isPrivate = false
  ): Promise<ConversationsCreateResponse['channel']> {
    const result = await this.web.conversations.create({
      name: name,
      is_private: isPrivate,
    });
    return result.channel;
  }

  /**
   * Adds a reaction to a message.
   * @param channelId The ID of the channel where the message is.
   * @param timestamp The timestamp of the message to react to.
   * @param reaction The name of the emoji to use for the reaction.
   */
  async reactMessage(
    channelId: string,
    timestamp: string,
    reaction: string
  ): Promise<ReactionsAddResponse> {
    return this.web.reactions.add({
      channel: channelId,
      timestamp: timestamp,
      name: reaction,
    });
  }

  /**
   * Gets information about a user.
   * @param userId The ID of the user to get information for.
   */
  async getUserInfo(userId: string) {
    const result = await this.web.users.info({
      user: userId,
    });
    return result.user;
  }

  /**
   * Replies to a message in a thread.
   * @param channelId The ID of the channel where the message is.
   * @param thread_ts The timestamp of the message to reply to, establishing the thread.
   * @param text The text of the reply.
   */
  async replyMessage(
    channelId: string,
    thread_ts: string,
    text: string
  ): Promise<ChatPostMessageResponse> {
    return this.web.chat.postMessage({
      channel: channelId,
      thread_ts: thread_ts,
      text: text,
    });
  }

  /**
   * Adds a user to a channel.
   * @param channelId The ID of the channel to add the user to.
   * @param userId The ID of the user to add.
   */
  async addUserToChannel(
    channelId: string,
    userId: string
  ): Promise<ConversationsInviteResponse> {
    return this.web.conversations.invite({
      channel: channelId,
      users: userId,
    });
  }

  /**
   * Removes a user from a channel.
   * @param channelId The ID of the channel to remove the user from.
   * @param userId The ID of the user to remove.
   */
  async removeUserFromChannel(
    channelId: string,
    userId: string
  ): Promise<ConversationsKickResponse> {
    return this.web.conversations.kick({
      channel: channelId,
      user: userId,
    });
  }

  /**
   * Uploads a file to a channel.
   * @param channelId The ID of the channel to upload the file to. Can be a comma-separated list of strings.
   * @param file A Buffer containing the file content.
   * @param filename The name of the file.
   * @param title An optional title for the file.
   */
  async sendFile(
    channelId: string,
    file: Buffer,
    filename: string,
    title?: string
  ): Promise<FilesUploadResponse> {
    return this.web.files.upload({
      channels: channelId,
      file: file,
      filename: filename,
      title: title,
    });
  }

  /**
   * Gets information about a file.
   * @param fileId The ID of the file to get information for.
   */
  async getFileInfo(fileId: string) {
    const result = await this.web.files.info({
      file: fileId,
    });
    return result.file;
  }
} 