import {
  WebClient,
  WebClientOptions,
  ChatPostMessageResponse,
  ConversationsCreateResponse,
  ConversationsInviteResponse,
  ConversationsKickResponse,
  ReactionsAddResponse,
  RemindersAddResponse,
  ChatPostMessageArguments,
  ConversationsListResponse,
  ConversationsInfoResponse,
  ConversationsJoinResponse,
  UsersListResponse,
  ConversationsHistoryResponse,
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
   * @param cursor A cursor to the next page of results.
   * @param limit The maximum number of channels to return.
   */
  async getChannels({
    cursor,
    limit = 50,
  }: {
    cursor?: string;
    limit?: number;
  }): Promise<{
    channels: ConversationsListResponse['channels'];
    nextCursor: string | undefined;
  }> {
    let channels: ConversationsListResponse['channels'] = [];
    let nextCursor: string | undefined = cursor;
    let hasMore = true;
    while (hasMore) {
      const result = await this.web.conversations.list({
        types: 'public_channel,private_channel,im',
        limit,
        cursor: nextCursor,
      });
      channels = [...channels, ...(result.channels || [])];
      nextCursor = result.response_metadata?.next_cursor;
      hasMore = !!nextCursor && channels.length < limit;
    }
    return {
      channels,
      nextCursor,
    };
  }

  /**
   * Lists all public, private and direct message channels in a workspace.
   * @param cursor A cursor to the next page of results.
   * @param limit The maximum number of channels to return.
   */
  async getChannelsIds({
    cursor,
    limit,
  }: {
    cursor?: string;
    limit?: number;
  }) {
    const response = await this.getChannels({ cursor, limit });
    return {
      channels: response.channels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
      })) || [],
      nextCursor: response.nextCursor,
    }
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
   * @param cursor A cursor to the next page of results.
   * @param limit The maximum number of users to return.
   * @param includeBots Whether to include bots.
   */
  async getActiveUsers({
    cursor,
    limit,
    includeBots = false,
  }: {
    cursor?: string;
    limit?: number;
    includeBots?: boolean;
  }): Promise<{
    users: UsersListResponse['members'];
    nextCursor: string | undefined;
  }> {
    const result = await this.web.users.list({
      limit: limit || 100,
      ...(cursor ? { cursor } : {}),
    });
    return {
      users: result.members?.filter((member) => !member.deleted)?.filter((member) => includeBots ? true : !member.is_bot) || [],
      nextCursor: result.response_metadata?.next_cursor,
    }
  }

  /**
   * Lists all users in a workspace.
   * @param cursor A cursor to the next page of results.
   * @param limit The maximum number of users to return.
   * @param includeBots Whether to include bots.
   */
  async getActiveUsersIds({
    cursor,
    limit,
    includeBots = false,
  }: {
    includeBots?: boolean;
    cursor?: string;
    limit?: number;
  }): Promise<{
    users: {
      id: string;
      name: string;
      email: string;
    }[];
    nextCursor: string | undefined;
  }> {
    const response = await this.getActiveUsers({ includeBots, cursor, limit });
    return {
      users: response.users?.map((user) => ({
        id: user.id || '',
        name: user.name || '',
        email: user.profile?.email || '',
      })) || [],
      nextCursor: response.nextCursor,
    }
  }

  /**
   * Lists all users in a channel.
   * @param channelId Channel ID to get members of.
   */
  async getChannelMembers(channelId: string) {
    const result = await this.web.conversations.members({
      channel: channelId,
    });
    return result.members;
  }

  /**
   * Finds a user by their email address.
   * @param email The email address of the user to find.
   */
  async getUserByEmail(email: string) {
    const result = await this.web.users.lookupByEmail({ email });
    return result.user;
  }

  /**
   * Finds users by their email addresses.
   * @param emails The email addresses of the users to find.
   */
  async getUsersByEmails({
    emails,
  }: {
    emails: string[];
  }) {
    const result = await Promise.all(emails.map(async (email) => {
      const user = await this.getUserByEmail(email);
      return user;
    }));
    return result;
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
    isPrivate = false,
    join = true,
  }: {
    name: string;
    isPrivate?: boolean;
    join?: boolean;
  }): Promise<ConversationsCreateResponse['channel']> {
    const result = await this.web.conversations.create({
      name: name,
      is_private: isPrivate,
    });
    if (join && result?.channel?.id) {
      await this.joinChannel({ channelId: result.channel.id });
    }
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
   * Joins a channel.
   * @param channelId The ID of the channel to join.
   */
  async joinChannel({
    channelId
  }: {
    channelId: string;
  }): Promise<ConversationsJoinResponse> {
    return this.web.conversations.join({
      channel: channelId,
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
  }): Promise<{
    messages: ConversationsHistoryResponse['messages'];
    nextCursor: string | undefined;
  }> {
    const result = await this.web.conversations.history({
      channel: channelId,
      limit,
      latest,
      oldest,
      inclusive,
      cursor,
    });
    return {
      messages: result.messages || [],
      nextCursor: result.response_metadata?.next_cursor,
    }
  }

  /**
   * Uploads a file to a channel using an external URL.
   * @param filename The name of the file.
   * @param file A Buffer containing the file content.
   * @param channelId The ID of the channel to upload the file to. Can be a comma-separated list of strings.
   * @param alt_text Description of image for screen-reader.
   * @param snippet_type Syntax type of the snippet being uploaded.
   * @param initialComment The message text introducing the file in specified channels.
   * @param title An optional title for the file.
   */
  async uploadFile({
    filename,
    file,
    channelId,
    alt_text,
    snippet_type,
    initialComment,
    title,
  }: {
    filename: string;
    file: Buffer;
    channelId?: string;
    alt_text?: string;
    snippet_type?: string;
    initialComment?: string;
    title?: string;
  }) {
    // Step 1: Get an upload URL
    const uploadURLResponse = await this.web.files.getUploadURLExternal({
      filename,
      length: file.length,
      alt_text,
      snippet_type,
    });

    if (!uploadURLResponse.ok || !uploadURLResponse.upload_url || !uploadURLResponse.file_id) {
      throw new Error(`Failed to get upload URL: ${uploadURLResponse.error}`);
    }

    const { upload_url, file_id } = uploadURLResponse;

    // Step 2: Upload the file to the URL
    const uploadResponse = await fetch(upload_url, {
      method: 'POST',
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`File upload failed with status: ${uploadResponse.statusText}`);
    }

    // Step 3: Complete the upload
    const completeUploadResponse = await this.web.files.completeUploadExternal({
      files: [{ id: file_id, title: title || filename }],
      channel_id: channelId,
      initial_comment: initialComment,
    });

    if (!completeUploadResponse.ok) {
      throw new Error(`Failed to complete upload: ${completeUploadResponse.error}`);
    }

    return completeUploadResponse.files;
  }
} 
