import { type WebhookEvent } from '@microfox/webhook-core';
import {
  convertSlackPayloadToWebhookEvent,
  slackMainEventsToTrack,
} from './slack';
import { ConnectorConfig } from '../schemas';
import { convertWhatsAppPayloadToWebhookEvent } from './whatsapp';

export const isEventTracked = (name: string, payload?: any) => {
  switch (name) {
    case 'slack':
      return slackMainEventsToTrack.includes(payload?.event?.type);
    default:
      throw new Error(`Unsupported connector: ${name}`);
  }
};

export const convertPayloadToWebhookEvent = (
  name: string,
  payload: any,
  connectorConfig: ConnectorConfig,
): WebhookEvent => {
  switch (name) {
    case 'slack':
      return convertSlackPayloadToWebhookEvent(payload, connectorConfig);
    case 'whatsapp':
      return convertWhatsAppPayloadToWebhookEvent(payload, connectorConfig);
    default:
      throw new Error(`Unsupported connector: ${name}`);
  }
};
