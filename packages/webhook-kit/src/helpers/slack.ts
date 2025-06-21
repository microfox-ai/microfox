import { WebhhookEvent } from '@microfox/webhook-core';

const messageEvents = [
  'app_mention',
  'message',
  'message.im',
  'message.channels',
  'message.groups',
  'message.mpim',
  'message.app_home',
];
const openedEvents = ['app_home_opened'];

export const slackMainEventsToTrack: string[] = [
  ...messageEvents,
  ...openedEvents,
];

export const isBotMentioned = (payload: any) => {
  const bot = payload.authorizations?.find((auth: any) => auth.is_bot);
  return payload.event.text.includes(`<@${bot.user_id}>`);
};

export const convertSlackPayloadToWebhookEvent = (
  payload: any,
): WebhhookEvent => {
  const bot = payload.authorizations?.find((auth: any) => auth.is_bot);
  const cleanText = payload.event.text.replace(
    `<@${bot.user_id}>`,
    '@Microfox',
  );
  const channelType =
    payload.event.type === 'message.im'
      ? 'user_to_user'
      : payload.event.type === 'message.app_home'
        ? 'direct_message'
        : payload.event.type === 'message.channels'
          ? 'public_channel'
          : payload.event.type === 'message.groups'
            ? 'private_channel'
            : payload.event.type === 'message.mpim'
              ? 'private_channel'
              : 'direct_message';

  return {
    eventId: 'slack-' + payload.event_id,
    baseType: messageEvents.includes(payload.event_type) ? 'message' : 'opened',
    eventType: payload.event_type,
    timestamp: payload.event_ts,
    cleanText: cleanText,
    text: payload.event.text,
    blocks: payload.event.blocks,
    provider: 'slack',
    bot: {
      id: bot.user_id,
      appId: bot.api_app_id,
      isBotMentioned: isBotMentioned(payload),
    },
    team: {
      id: payload.team_id,
    },
    org: {
      id: payload.enterprise_id,
    },
    sender: {
      id: payload.event.user,
    },
    channel: {
      id: payload.event.channel,
      type: channelType,
    },
    event: {
      id: payload.event_id,
      msgId: payload.event.client_msg_id,
      text: payload.event.text,
      timestamp: payload.event.ts,
    },
    originalPayload: payload,
  };
};
