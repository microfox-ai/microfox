import { z } from 'zod';
import { createRestSDK } from '@microfox/rest-sdk';
import {
  DiscordSlashCommandSchema,
  DiscordModerationActionSchema,
  DiscordChannelSchema,
  DiscordRoleSchema,
  DiscordCommandHandlerSchema,
  DiscordSlashCommandInteractionSchema,
  type DiscordCommandHandler,
  type DiscordResponses,
} from './discord-schema';

const MessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').optional(),
  userId: z.string().optional(),
  channelId: z.string().optional(),
  fileUrl: z.string().url().optional(),
  embed: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      color: z.number().optional(),
      image: z.string().url().optional(),
    })
    .optional(),
});

export const DiscordConfigSchema = z.object({
  token: z.string().min(1, 'Discord bot token cannot be empty'),
});

export type DiscordConfig = z.infer<typeof DiscordConfigSchema>;

export const createDiscordSdk = (config: DiscordConfig) => {
  const BASE_URL = 'https://discord.com/api/v10';
  const botToken = config.token || process.env.DISCORD_BOT_TOKEN;

  if (!botToken) throw new Error('Discord bot token is required');

  // Initialize Microfox REST Client
  const restSdk = createRestSDK({
    baseUrl: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${botToken}`,
    },
  });

  // Store command handlers
  const commandHandlers = new Map<
    string,
    z.infer<typeof DiscordCommandHandlerSchema>
  >();

  const request = async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
    body?: any,
  ) => {
    try {
      const textResponse = await restSdk[
        method.toLowerCase() as keyof typeof restSdk
      ](endpoint, body).text();
      const jsonResponse = textResponse ? JSON.parse(textResponse) : {};

      return jsonResponse;
    } catch (error: any) {
      console.error(`❌ API Error: ${error.message}`, error);
      throw new Error(`API Error: ${error.message}`);
    }
  };

  /**
   * Respond to a slash command interaction
   */
  const respondToInteraction = async (
    interactionToken: string,
    response: {
      content?: string;
      embeds?: any[];
      components?: any[];
      ephemeral?: boolean;
    },
  ) => {
    return request(`/interactions/${interactionToken}/callback`, 'POST', {
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
      data: response,
    });
  };

  /**
   * Defer a slash command response
   */
  const deferInteraction = async (
    interactionToken: string,
    ephemeral: boolean = false,
  ) => {
    return request(`/interactions/${interactionToken}/callback`, 'POST', {
      type: 5, // DEFERRED_UPDATE_MESSAGE
      data: { flags: ephemeral ? 64 : 0 }, // 64 is the ephemeral flag
    });
  };

  /**
   * Follow up to a deferred interaction
   */
  const followUpInteraction = async (
    interactionToken: string,
    response: {
      content?: string;
      embeds?: any[];
      components?: any[];
      ephemeral?: boolean;
    },
  ) => {
    return request(
      `/webhooks/@me/${interactionToken}/messages/@original`,
      'PATCH',
      response,
    );
  };

  return {
    /**
     * Send a message to a user or a channel.
     */
    sendMessage: async (data: z.infer<typeof MessageSchema>) => {
      const parsedData = MessageSchema.parse(data);
      if (!parsedData.content && !parsedData.fileUrl && !parsedData.embed) {
        throw new Error('Either content, fileUrl, or embed must be provided');
      }

      let channelId = parsedData.channelId;

      if (parsedData.userId) {
        const dmChannel = await request('/users/@me/channels', 'POST', {
          recipient_id: parsedData.userId,
        });
        channelId = dmChannel.id;
      }

      if (!channelId)
        throw new Error('Either userId or channelId must be provided');

      const payload: any = { content: parsedData.content || '' };
      if (parsedData.fileUrl)
        payload.embeds = [{ image: { url: parsedData.fileUrl } }];
      if (parsedData.embed) payload.embeds = [parsedData.embed];

      return request(`/channels/${channelId}/messages`, 'POST', payload);
    },

    /**
     * Edit an existing message in a channel.
     * Now supports media (via embeds).
     */
    editMessage: async (
      channelId: string,
      messageId: string,
      newContent: string,
      fileUrl?: string,
    ) => {
      const payload: any = { content: newContent };
      if (fileUrl) {
        payload.embeds = [{ image: { url: fileUrl } }];
      }
      return request(
        `/channels/${channelId}/messages/${messageId}`,
        'PATCH',
        payload,
      );
    },

    /**
     * Delete a message in a channel.
     * Handles empty response issue from Discord API.
     */
    deleteMessage: async (channelId: string, messageId: string) => {
      try {
        await request(`/channels/${channelId}/messages/${messageId}`, 'DELETE');
      } catch (error) {
        console.error(`❌ Error deleting message ${messageId}:`, error);
      }
    },

    /**
     * Fetch recent messages from a channel.
     */
    fetchMessages: async (channelId: string, limit: number = 10) => {
      return request(`/channels/${channelId}/messages?limit=${limit}`, 'GET');
    },

    /**
     * React to a message with an emoji.
     */
    reactToMessage: async (
      channelId: string,
      messageId: string,
      emoji: string,
    ) => {
      return request(
        `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`,
        'PUT',
      );
    },

    /**
     * Create a thread in a channel.
     */
    createThread: async (
      channelId: string,
      messageId: string,
      name: string,
    ) => {
      return request(
        `/channels/${channelId}/messages/${messageId}/threads`,
        'POST',
        { name },
      );
    },

    /**
     * Fetch information about a guild (server).
     */
    fetchGuildInfo: async (guildId: string) => {
      return request(`/guilds/${guildId}`, 'GET');
    },

    /**
     * Fetch information about a user.
     */
    fetchUserInfo: async (userId: string) => {
      return request(`/users/${userId}`, 'GET');
    },

    /**
     * Register a slash command for the bot.
     */
    registerSlashCommand: async (
      guildId: string,
      command: z.infer<typeof DiscordSlashCommandSchema>,
    ) => {
      return request(
        `/applications/@me/guilds/${guildId}/commands`,
        'POST',
        command,
      );
    },

    /**
     * Register global slash commands for the bot.
     */
    registerGlobalSlashCommand: async (
      command: z.infer<typeof DiscordSlashCommandSchema>,
    ) => {
      return request('/applications/@me/commands', 'POST', command);
    },

    /**
     * Delete a slash command.
     */
    deleteSlashCommand: async (guildId: string, commandId: string) => {
      return request(
        `/applications/@me/guilds/${guildId}/commands/${commandId}`,
        'DELETE',
      );
    },

    /**
     * Delete a global slash command.
     */
    deleteGlobalSlashCommand: async (commandId: string) => {
      return request(`/applications/@me/commands/${commandId}`, 'DELETE');
    },

    /**
     * Perform a moderation action on a user.
     */
    moderateUser: async (
      guildId: string,
      userId: string,
      action: z.infer<typeof DiscordModerationActionSchema>,
    ) => {
      const { type, reason, duration, delete_message_days } = action;

      switch (type) {
        case 'ban':
          return request(`/guilds/${guildId}/bans/${userId}`, 'PUT', {
            delete_message_days,
            reason,
          });
        case 'kick':
          return request(`/guilds/${guildId}/members/${userId}`, 'DELETE', {
            reason,
          });
        case 'timeout':
          return request(`/guilds/${guildId}/members/${userId}`, 'PATCH', {
            communication_disabled_until: duration
              ? new Date(Date.now() + duration).toISOString()
              : null,
            reason,
          });
        default:
          throw new Error('Unsupported moderation action type');
      }
    },

    /**
     * Create a new channel in the guild.
     */
    createChannel: async (
      guildId: string,
      data: z.infer<typeof DiscordChannelSchema>,
    ) => {
      return request(`/guilds/${guildId}/channels`, 'POST', data);
    },

    /**
     * Update a channel's settings.
     */
    updateChannel: async (
      channelId: string,
      data: Partial<z.infer<typeof DiscordChannelSchema>>,
    ) => {
      return request(`/channels/${channelId}`, 'PATCH', data);
    },

    /**
     * Delete a channel.
     */
    deleteChannel: async (channelId: string) => {
      return request(`/channels/${channelId}`, 'DELETE');
    },

    /**
     * Create a new role in the guild.
     */
    createRole: async (
      guildId: string,
      data: z.infer<typeof DiscordRoleSchema>,
    ) => {
      return request(`/guilds/${guildId}/roles`, 'POST', data);
    },

    /**
     * Update a role's settings.
     */
    updateRole: async (
      guildId: string,
      roleId: string,
      data: Partial<z.infer<typeof DiscordRoleSchema>>,
    ) => {
      return request(`/guilds/${guildId}/roles/${roleId}`, 'PATCH', data);
    },

    /**
     * Delete a role.
     */
    deleteRole: async (guildId: string, roleId: string) => {
      return request(`/guilds/${guildId}/roles/${roleId}`, 'DELETE');
    },

    /**
     * Add a role to a user.
     */
    addRoleToUser: async (
      guildId: string,
      userId: string,
      roleId: string,
      reason?: string,
    ) => {
      return request(
        `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
        'PUT',
        { reason },
      );
    },

    /**
     * Remove a role from a user.
     */
    removeRoleFromUser: async (
      guildId: string,
      userId: string,
      roleId: string,
      reason?: string,
    ) => {
      return request(
        `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
        'DELETE',
        { reason },
      );
    },

    /**
     * Fetch all channels in a guild.
     */
    fetchChannels: async (guildId: string) => {
      return request(`/guilds/${guildId}/channels`, 'GET');
    },

    /**
     * Fetch all roles in a guild.
     */
    fetchRoles: async (guildId: string) => {
      return request(`/guilds/${guildId}/roles`, 'GET');
    },

    /**
     * Fetch all slash commands for a guild.
     */
    fetchSlashCommands: async (guildId: string) => {
      return request(`/applications/@me/guilds/${guildId}/commands`, 'GET');
    },

    /**
     * Fetch all global slash commands.
     */
    fetchGlobalSlashCommands: async () => {
      return request('/applications/@me/commands', 'GET');
    },

    /**
     * Register a command handler
     */
    registerCommand: async function (
      guildId: string,
      command: z.infer<typeof DiscordCommandHandlerSchema>,
    ) {
      // Store the handler
      commandHandlers.set(command.name, command);
      if (!command.name || !command.description) {
        throw new Error('Command name and description are required');
      }
      return this.registerSlashCommand(guildId, {
        name: command.name,
        description: command.description,
        options: command.options ?? [],
        default_member_permissions:
          command.default_member_permissions ?? undefined,
        dm_permission: command.dm_permission ?? undefined,
      });
    },

    /**
     * Register a global command handler
     */
    registerGlobalCommand: async function (
      command: z.infer<typeof DiscordCommandHandlerSchema>,
    ) {
      // Store the handler
      commandHandlers.set(command.name, command);

      // Register the command with Discord
      return this.registerGlobalSlashCommand({
        name: command.name,
        description: command.description,
        options: command.options ?? [],
        default_member_permissions:
          command.default_member_permissions ?? undefined,
        dm_permission: command.dm_permission ?? undefined,
      });
    },

    /**
     * Handle a slash command interaction
     */
    handleInteraction: async (interaction: any) => {
      const parsedInteraction =
        DiscordSlashCommandInteractionSchema.parse(interaction);

      if (!parsedInteraction.data) {
        throw new Error('No command data in interaction');
      }

      const commandName = parsedInteraction.data.name;
      const handler = commandHandlers.get(commandName);

      if (!handler) {
        throw new Error(`No handler found for command: ${commandName}`);
      }

      // Parse options into a more usable format
      const options: Record<string, any> = {};
      if (parsedInteraction.data.options) {
        for (const option of parsedInteraction.data.options) {
          options[option.name] = option.value;
        }
      }

      // Execute the handler
      await (handler.handler as DiscordCommandHandler)(
        parsedInteraction,
        options,
      );
    },

    /**
     * Respond to a slash command interaction
     */
    respondToInteraction,

    /**
     * Defer a slash command response
     */
    deferInteraction,

    /**
     * Follow up to a deferred interaction
     */
    followUpInteraction,
  };
};
