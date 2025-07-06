import {
  Webhook,
  WebhookRequest,
  WebhookResponse,
  WebhookVerificationError,
} from '@microfox/webhook-core';
import {
  WhatsAppWebhookPayloadSchema,
  WhatsAppMessage,
  WhatsAppWebhookPayload,
} from './types';

interface WhatsAppWebhookOptions {
  secret: string;
  verifyToken?: string;
}

export class WhatsAppWebhook extends Webhook {
  private verifyToken: string;
  private callbacks: Record<string, ((args: any) => Promise<void> | void)[]> =
    {};

  constructor(options: WhatsAppWebhookOptions) {
    super(options);
    this.verifyToken =
      options.verifyToken || process.env.WHATSAPP_VERIFY_TOKEN || '';
    if (!this.verifyToken) {
      throw new Error('WhatsApp verify token is required.');
    }
  }

  async sign(payload: string | Buffer): Promise<string> {
    throw new Error('Signing is not supported by the WhatsApp adapter.');
  }

  async verify(payload: string | Buffer, signature: string): Promise<boolean> {
    // WhatsApp doesn't use signature verification in the same way as other platforms
    // The verification is done through the verify token in GET requests
    return true;
  }

  public verifyGetRequest(query: any): string | false {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    return false;
  }

  async receive(request: WebhookRequest): Promise<WebhookResponse | void> {
    try {
      const body = JSON.parse(request.body.toString());
      const parsedPayload: WhatsAppWebhookPayload =
        WhatsAppWebhookPayloadSchema.parse(body);

      // Process messages and emit events
      parsedPayload.entry.forEach(entry => {
        entry.changes.forEach(change => {
          if (change.field === 'messages' && change.value.messages) {
            change.value.messages.forEach(message => {
              // Emit message event
              if (this.callbacks.message) {
                this.callbacks.message.forEach(cb => cb(message));
              }
            });
          }
        });
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true }),
        payload: parsedPayload,
      };
    } catch (error) {
      // Emit error event
      if (this.callbacks.error) {
        this.callbacks.error.forEach(cb => cb(error));
      }
      throw new WebhookVerificationError('Failed to process WhatsApp webhook');
    }
  }

  on(event: 'message', listener: (message: WhatsAppMessage) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    if (this.callbacks[event]) {
      this.callbacks[event].push(listener);
    } else {
      this.callbacks[event] = [listener];
    }
    return this;
  }
}
