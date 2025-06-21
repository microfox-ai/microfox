import { WebhhookEvent } from '@microfox/webhook-core';
import {
  convertSlackPayloadToWebhookEvent,
  slackMainEventsToTrack,
} from './slack';

export const isEventTracked = (name: string, event: any) => {
  switch (name) {
    case 'slack':
      return slackMainEventsToTrack.includes(event.event.type);
    default:
      throw new Error(`Unsupported connector: ${name}`);
  }
};

export const convertPayloadToWebhookEvent = (
  name: string,
  payload: any,
): WebhhookEvent => {
  switch (name) {
    case 'slack':
      return convertSlackPayloadToWebhookEvent(payload);
    default:
      throw new Error(`Unsupported connector: ${name}`);
  }
};
