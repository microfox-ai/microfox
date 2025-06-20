import { Webhook, WebhookRequest } from '@microfox/webhook-core';

export {
  WebhookVerificationError,
  type WebhookRequest,
  Webhook,
} from '@microfox/webhook-core';

export class WebhookKit {
  private webhooks: Record<string, Webhook<any>>;

  constructor() {
    this.webhooks = {};
  }

  addWebhook(name: string, webhook: Webhook<any>) {
    this.webhooks[name] = webhook;
  }

  getWebhook(name: string): Webhook<any> | undefined {
    return this.webhooks[name];
  }

  async receive(name: string, request: WebhookRequest): Promise<void> {
    const webhook = this.getWebhook(name);
    if (!webhook) {
      throw new Error(`Webhook with name "${name}" not found.`);
    }
    await webhook.receive(request);
  }
}
