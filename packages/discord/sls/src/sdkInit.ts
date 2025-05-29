import { createDiscordSdk } from '@microfox/discord';

export const sdkInit = (envVars: Record<string, string>): Record<string, Function> => {
    // Environment variable validation
    if (!envVars['DISCORD_BOT_TOKEN']) {
        throw new Error('DISCORD_BOT_TOKEN is required');
    }

    // Initialize SDK
    const sdk = createDiscordSdk({
        token: envVars['DISCORD_BOT_TOKEN'],
    });

    // Map functions
    const sdkMap: Record<string, Function> = {
        sendMessage: sdk.sendMessage.bind(sdk),
        editMessage: sdk.editMessage.bind(sdk),
        deleteMessage: sdk.deleteMessage.bind(sdk),
        fetchMessages: sdk.fetchMessages.bind(sdk),
        reactToMessage: sdk.reactToMessage.bind(sdk),
        createThread: sdk.createThread.bind(sdk),
        fetchGuildInfo: sdk.fetchGuildInfo.bind(sdk),
        fetchUserInfo: sdk.fetchUserInfo.bind(sdk),
        registerSlashCommand: sdk.registerSlashCommand.bind(sdk),
        registerGlobalSlashCommand: sdk.registerGlobalSlashCommand.bind(sdk),
        deleteSlashCommand: sdk.deleteSlashCommand.bind(sdk),
        deleteGlobalSlashCommand: sdk.deleteGlobalSlashCommand.bind(sdk),
        moderateUser: sdk.moderateUser.bind(sdk),
        createChannel: sdk.createChannel.bind(sdk),
        updateChannel: sdk.updateChannel.bind(sdk),
        deleteChannel: sdk.deleteChannel.bind(sdk),
        createRole: sdk.createRole.bind(sdk),
        updateRole: sdk.updateRole.bind(sdk),
        deleteRole: sdk.deleteRole.bind(sdk),
        addRoleToUser: sdk.addRoleToUser.bind(sdk),
        removeRoleFromUser: sdk.removeRoleFromUser.bind(sdk),
        fetchChannels: sdk.fetchChannels.bind(sdk),
        fetchRoles: sdk.fetchRoles.bind(sdk),
        fetchSlashCommands: sdk.fetchSlashCommands.bind(sdk),
        fetchGlobalSlashCommands: sdk.fetchGlobalSlashCommands.bind(sdk),
        registerCommand: sdk.registerCommand.bind(sdk),
        registerGlobalCommand: sdk.registerGlobalCommand.bind(sdk),
        handleInteraction: sdk.handleInteraction.bind(sdk),
        respondToInteraction: sdk.respondToInteraction.bind(sdk),
        deferInteraction: sdk.deferInteraction.bind(sdk),
        followUpInteraction: sdk.followUpInteraction.bind(sdk),
    };

    return sdkMap;
}