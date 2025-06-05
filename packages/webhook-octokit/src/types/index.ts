import { EventPayloadMap } from '@octokit/webhooks/dist-types/generated/webhook-identifiers.js';
import { WebhookEvents } from '@octokit/webhooks/dist-types/types.js';

export type OctokitWebhookEvent<TEvent extends WebhookEvents> = {
  id: string;
  name: TEvent;
  payload: EventPayloadMap[TEvent];
};
