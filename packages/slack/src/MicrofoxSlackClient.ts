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
  ChatPostMessageArguments,
  ConversationsListResponse,
  ConversationsInfoResponse
} from '@slack/web-api';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

dotenv.config();

export class MicrofoxSlackClient {
  private web: WebClient;

  constructor(token: string, options?: WebClientOptions) {
    this.web = new WebClient(token, options);
  }

  /**
   * Lists all public, private and direct message channels in a workspace.
   */
  async listChannels(): Promise<ConversationsListResponse['channels']> {
    const result = await this.web.conversations.list({
      types: 'public_channel,private_channel,im',
    });
    return result.channels;
  }

  /**
   * Fetches information about a conversation.
   * @param channelId Conversation ID to fetch information for.
   */
  async getChannelConversationInfo(channelId: string): Promise<ConversationsInfoResponse['channel']> {
    const result = await this.web.conversations.info({
      channel: channelId,
    });
    return result.channel;
  }

  /**
   * Lists all users in a workspace.
   */
  async listActiveUsers() {
    const result = await this.web.users.list({
      limit: 1000,
    });
    return result.members?.filter((member) => !member.deleted);
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
  async searchUserByEmail(email: string) {
    const result = await this.web.users.lookupByEmail({ email });
    return result.user;
  }

  /**
   * Sends a direct message to a user.
   * @param userId The ID of the user to message.
   * @param text The text of the message to send.
   */
  async messageUser({
    userId,
    text
  }: {
    userId: string;
    text: string;
  }): Promise<ChatPostMessageResponse> {
    const im = await this.web.conversations.open({ users: userId });
    if (im.ok && im.channel?.id) {
      return this.messageChannel({ channelId: im.channel.id, text });
    }
    throw new Error(`Could not open DM with user ${userId}`);
  }

  /**
   * Sends a message to a channel.
   * @param channelId The ID of the channel to message.
   * @param text The text of the message to send.
   */
  async messageChannel({
    channelId,
    text
  }: {
    channelId: string;
    text: string;
  }): Promise<ChatPostMessageResponse> {
    let payload: ChatPostMessageArguments = {
      channel: channelId,
      text: text,
    };

    if (process.env.SLACK_AUTHOR_NAME) {
      payload.username = process.env.SLACK_AUTHOR_NAME;
    }
    if (process.env.SLACK_ICON_URL) {
      payload.icon_url = process.env.SLACK_ICON_URL;
    }
    return this.web.chat.postMessage(payload);
  }

  /**
   * Sets a reminder for a user.
   * @param userId The ID of the user to set a reminder for.
   * @param text The text of the reminder.
   * @param time A string describing when the reminder should fire (e.g., "in 5 minutes" or a Unix timestamp).
   */
  async setReminder({
    userId,
    text,
    time
  }: {
    userId: string;
    text: string;
    time: string;
  }): Promise<RemindersAddResponse> {
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
  async createChannel({
    name,
    isPrivate = false
  }: {
    name: string;
    isPrivate?: boolean;
  }): Promise<ConversationsCreateResponse['channel']> {
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
  async reactMessage({
    channelId,
    timestamp,
    reaction
  }: {
    channelId: string;
    timestamp: string;
    reaction: string;
  }): Promise<ReactionsAddResponse> {
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
  async replyMessage({
    channelId,
    thread_ts,
    text
  }: {
    channelId: string;
    thread_ts: string;
    text: string;
  }): Promise<ChatPostMessageResponse> {
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
  async addUserToChannel({
    channelId,
    userId
  }: {
    channelId: string;
    userId: string;
  }): Promise<ConversationsInviteResponse> {
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
  async removeUserFromChannel({
    channelId,
    userId
  }: {
    channelId: string;
    userId: string;
  }): Promise<ConversationsKickResponse> {
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
  async sendFile({
    channelId,
    file,
    filename,
    title
  }: {
    channelId: string;
    file: Buffer;
    filename: string;
    title?: string;
  }): Promise<FilesUploadResponse> {
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

  /**
   * Fetches a conversation's history of messages and events.
   * @param channelId Conversation ID to fetch history for.
   * @param limit The maximum number of items to return.
   * @param latest End of the time range of messages to include in results.
   * @param oldest Start of the time range of messages to include in results.
   * @param inclusive Include messages with latest or oldest timestamps in results.
   * @param cursor Paginate through collections of data by setting the cursor parameter to a next_cursor attribute returned by a previous request's response_metadata.
   */
  async getConversationHistory({
    channelId,
    limit,
    latest,
    oldest,
    inclusive,
    cursor,
  }: {
    channelId: string;
    limit?: number;
    latest?: string;
    oldest?: string;
    inclusive?: boolean;
    cursor?: string;
  }) {
    const result = await this.web.conversations.history({
      channel: channelId,
      limit,
      latest,
      oldest,
      inclusive,
      cursor,
    });
    return result.messages;
  }
} 