import { Webhooks } from '@octokit/webhooks';
import { EventPayloadMap } from '@octokit/webhooks/dist-types/generated/webhook-identifiers.js';
import { WebhookEvents } from '@octokit/webhooks/dist-types/types.js';

import {
  Webhook,
  WebhookRequest,
  WebhookResponse,
  WebhookVerificationError,
} from '@microfox/webhook-core';

export class OctokitWebhook extends Webhook {
  private webhook: Webhooks;

  constructor(options: { secret: string }) {
    super(options);
    this.webhook = new Webhooks({ secret: options.secret });
  }

  async sign(payload: string | Buffer): Promise<string> {
    const payloadString = payload.toString();
    return this.webhook.sign(payloadString);
  }

  async verify(payload: string | Buffer, signature: string): Promise<boolean> {
    const payloadString = payload.toString();
    return this.webhook.verify(payloadString, signature);
  }

  async receive(request: WebhookRequest): Promise<void | WebhookResponse> {
    const signature = request.headers['x-hub-signature-256'] as string;
    if (!signature) {
      throw new WebhookVerificationError('No signature found in headers');
    }
    const valid = await this.verify(request.body, signature);
    if (!valid) {
      throw new WebhookVerificationError('Invalid signature');
    }

    const headers: Record<string, string | number | string[] | undefined> = {};
    for (const key in request.headers) {
      const value = request.headers[key];
      if (Array.isArray(value)) {
        headers[key] = value[0];
      } else {
        headers[key] = value;
      }
    }

    await this.webhook.verifyAndReceive({
      id: (request.headers['x-github-delivery'] as string) ?? '',
      name: request.headers['x-github-event'] as any,
      payload: request.body.toString(),
      signature: signature,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
      payload: request.body,
    };
  }

  on<E extends WebhookEvents>(
    event: E | E[],
    listener: (event: {
      id: string;
      name: E;
      payload: EventPayloadMap[E];
    }) => void,
  ): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(
    event: WebhookEvents | WebhookEvents[] | 'error',
    listener:
      | ((event: {
          id: string;
          name: WebhookEvents;
          payload: EventPayloadMap[WebhookEvents];
        }) => void)
      | ((error: Error) => void),
  ): this {
    if (event === 'error') {
      this.webhook.onError(e =>
        (listener as (error: Error) => void)(e.errors[0]),
      );
      return this;
    }
    this.webhook.on(event as any, listener as any);
    return this;
  }

  onAny(
    listener: (event: {
      id: string;
      name: WebhookEvents;
      payload: EventPayloadMap[WebhookEvents];
    }) => void,
  ): this {
    this.webhook.onAny(listener);
    return this;
  }
}
