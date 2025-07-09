import {
  Webhook,
  WebhookRequest,
  WebhookResponse,
} from '@microfox/webhook-core';
import { SlackWebhook } from '@microfox/webhook-slack';
import { OctokitWebhook } from '@microfox/webhook-octokit';
import { WhatsAppWebhook } from '@microfox/webhook-whatsapp';
import { convertPayloadToWebhookEvent, isEventTracked } from './helpers';
import { ConnectorConfig } from './schemas';

export {
  WebhookVerificationError,
  type WebhookRequest,
  type WebhookResponse,
  Webhook,
} from '@microfox/webhook-core';

/**
 * WebhookKit is a class that allows you to create a webhook kit for a given connector.
 * It will create a webhook for each connector and add it to the webhooks object.
 * It will also add the webhook to the webhooks object.
 * It will also add the webhook to the webhooks object.
 */
export class WebhookKit {
  private webhooks: Record<string, Webhook<any>>;
  private connectors: Record<string, ConnectorConfig>;

  constructor(_connectors: Record<string, ConnectorConfig> | undefined = {}) {
    this.webhooks = {};
    if (_connectors) {
      this.connectors = _connectors;
    } else {
      this.connectors = {};
    }
    for (const [connector, secret] of Object.entries(_connectors)) {
      switch (connector) {
        case 'slack':
          this.webhooks[connector] = new SlackWebhook({
            secret: secret.secret || process.env.SLACK_SIGNING_SECRET || '',
            botToken: secret.botToken || process.env.SLACK_BOT_TOKEN || '',
          });
          break;
        case 'octokit':
          this.webhooks[connector] = new OctokitWebhook({
            secret: secret.secret || process.env.OCTOKIT_SIGNING_SECRET || '',
          });
          break;
        case 'whatsapp':
          this.webhooks[connector] = new WhatsAppWebhook({
            secret: secret.secret || process.env.WHATSAPP_SIGNING_SECRET || '',
          });
          break;
        default:
          throw new Error(`Unsupported connector: ${connector}`);
      }
    }
  }

  addWebhook(name: string, webhook: Webhook<any>) {
    this.webhooks[name] = webhook;
  }

  getWebhook(name: string): Webhook<any> | undefined {
    return this.webhooks[name];
  }

  async receive(
    name: string,
    request: WebhookRequest,
  ): Promise<WebhookResponse | void> {
    const webhook = this.getWebhook(name);
    if (!webhook) {
      throw new Error(`Webhook with name "${name}" not found.`);
    }
    const response = await webhook.receive(request);
    console.log('response', response);
    if (
      response &&
      response.payload &&
      this.connectors[name] &&
      isEventTracked(name, response.payload)
    ) {
      return {
        ...response,
        isTracked: true,
        webhookEvent: convertPayloadToWebhookEvent(
          name,
          response.payload,
          this.connectors[name],
        ),
      };
    }
    return response;
  }

  async receiveAll(request: WebhookRequest): Promise<WebhookResponse | void> {
    const responses = await Promise.all(
      Object.entries(this.connectors).map(async ([connector, secret]) => {
        const webhook = this.getWebhook(connector);
        if (!webhook) {
          throw new Error(`Webhook with name "${connector}" not found.`);
        }
        return await webhook.receive(request);
      }),
    );
    return responses.find(response => response !== undefined);
  }
}
