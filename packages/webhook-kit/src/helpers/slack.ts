import { type WebhookEvent } from '@microfox/webhook-core';
import { ConnectorConfig } from '../schemas';

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

// TODO: enforce with connector config
export const isBotMentioned = (
  payload: any,
  connectorConfig: ConnectorConfig,
) => {
  const bot = payload.authorizations?.find((auth: any) => auth.is_bot);
  return (
    payload.event.text.includes(`<@${bot.user_id}>`) ||
    payload.event.text.includes(`<@${connectorConfig.appMentionId}>`)
  );
};

export const convertSlackPayloadToWebhookEvent = (
  payload: any,
  connectorConfig: ConnectorConfig,
): WebhookEvent => {
  const bot = payload.authorizations?.find((auth: any) => auth.is_bot);
  const cleanText = payload.event.text.replace(
    `<@${connectorConfig.appMentionId || bot.user_id}>`,
    `@${connectorConfig.appName}`,
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
    event_id: 'slack-' + payload.event_id,
    base_type: messageEvents.includes(payload.event_type)
      ? 'message'
      : 'opened',
    event_type: payload.event_type,
    timestamp: payload.event_ts,
    clean_text: cleanText,
    text: payload.event.text,
    blocks: payload.event.blocks,
    provider: 'slack',
    bot: {
      id: bot.user_id,
      app_id: bot.api_app_id,
      is_bot_mentioned: isBotMentioned(payload, connectorConfig),
    },
    provider_info: {
      team: {
        id: payload.team_id,
      },
      org: {
        id: payload.enterprise_id,
      },
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
      type: payload.event_type,
      subtype: payload.event.subtype,
      msg_id: payload.event.client_msg_id,
      text: payload.event.text,
      ts: payload.event.ts,
      parent_ts: payload.event.thread_ts,
    },
    original_payload: payload,
  };
};
