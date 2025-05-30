import { Webhooks } from '@octokit/webhooks';
import { WebhookEvents } from '@octokit/webhooks/dist-types/types';

export class OctokitWebhook {
  private webhook: Webhooks;

  constructor(props: { secret: string }) {
    this.webhook = new Webhooks({
      secret: props.secret,
    });
  }

  async sign(payload: string) {
    return this.webhook.sign(payload);
  }

  async verifySignature(payload: string, signature: string) {
    return this.webhook.verify(payload, signature);
  }

  async on(
    event: WebhookEvents | WebhookEvents[],
    handler: (event: { id: string; name: WebhookEvents; payload: any }) => void,
  ) {
    return this.webhook.on(event, handler);
  }

  async onAny(
    handler: (event: { id: string; name: WebhookEvents; payload: any }) => void,
  ) {
    return this.webhook.onAny(handler);
  }

  async verifyAndReceive(
    rawBody: string,
    headers: Record<string, string | undefined>,
  ) {
    const request = {
      headers,
      body: rawBody,
    };
    return this.webhook.verifyAndReceive({
      id: request.headers['x-github-delivery'] ?? '',
      name: request.headers['x-github-event'] ?? '',
      payload: request.body,
      signature: request.headers['x-hub-signature-256'] ?? '',
    });
  }
}
