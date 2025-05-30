import { EventPayloadMap } from '@octokit/webhooks/dist-types/generated/webhook-identifiers';
import { WebhookEvents } from '@octokit/webhooks/dist-types/types';

export type OctokitWebhookEvent<TEvent extends WebhookEvents> = {
  id: string;
  name: TEvent;
  payload: EventPayloadMap[TEvent];
};
