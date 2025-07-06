import { type WebhookEvent } from '@microfox/webhook-core';
import { ConnectorConfig } from '../schemas';
import {
  WhatsAppWebhookPayload,
  WhatsAppMessage,
} from '@microfox/webhook-whatsapp';

export const convertWhatsAppPayloadToWebhookEvent = (
  rawPayload: any,
  connectorConfig: ConnectorConfig,
): WebhookEvent => {
  const payload = rawPayload as WhatsAppWebhookPayload;
  const change = payload.entry[0].changes[0];
  const message = change.value.messages?.[0] || {
    id: 'unknown',
    from: 'unknown',
    type: 'text',
    timestamp: Date.now().toString(),
    text: { body: '' },
  };
  const contact = change.value.contacts?.[0];

  return {
    event_id: `whatsapp-${message.id}`,
    base_type: 'message',
    event_type: `message.${message.type}`,
    timestamp: parseInt(message.timestamp, 10),
    clean_text: message.text.body,
    text: message.text.body,
    blocks: [],
    provider: 'whatsapp',
    bot: {
      id: change.value.metadata.phone_number_id,
      app_id: connectorConfig.appId,
      is_bot_mentioned: false, // WhatsApp doesn't have a concept of bot mentions in the same way as Slack/GitHub
    },
    provider_info: {
      team: {
        id: '', // Not available in payload
      },
      org: {
        id: '', // Not available in payload
      },
    },
    sender: {
      id: message.from,
      name: contact?.profile.name,
    },
    channel: {
      id: message.from,
      type: 'direct_message',
    },
    event: {
      id: message.id,
      type: message.type,
      text: message.text.body,
      ts: message.timestamp,
    },
    original_payload: rawPayload,
  };
};
