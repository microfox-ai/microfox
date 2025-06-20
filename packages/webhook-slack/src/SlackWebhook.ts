import {
  Webhook,
  WebhookRequest,
  WebhookResponse,
  WebhookVerificationError,
} from '@microfox/webhook-core';
import {
  isValidSlackRequest,
  type AckFn,
  type BlockElementAction,
  type Context,
  type DialogSubmitAction,
  type DialogValidation,
  type EnvelopedEvent,
  type InteractiveAction,
  type KnownEventFromType,
  type RespondArguments,
  type RespondFn,
  type SayArguments,
  type SayFn,
  type SlackAction,
  type SlackShortcut,
  type SlashCommand,
  type StringIndexed,
} from '@slack/bolt';
import { type AllMessageEvents } from './types';

export class WebhookParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookParseError';
  }
}

interface MessageCallbackArgs {
  message: AllMessageEvents;
  context: Context & StringIndexed;
  say: SayFn;
  body: EnvelopedEvent<AllMessageEvents>;
}

/**
 * SlackWebhook - A class for handling Slack webhooks
 */
export class SlackWebhook extends Webhook {
  private botToken?: string;
  private callbacks: Record<string, ((args: any) => Promise<void> | void)[]> =
    {};

  constructor(options: { secret: string; botToken?: string }) {
    super(options);
    this.botToken = options.botToken ?? process.env.SLACK_BOT_TOKEN;
    if (!this.botToken) {
      throw new Error('Bot token is required');
    }
  }

  async sign(payload: string | Buffer): Promise<string> {
    throw new Error('Signing is not supported by the Slack adapter.');
  }

  async verify(
    payload: string | Buffer,
    signature: string,
    timestamp?: number,
  ): Promise<boolean> {
    const payloadString = payload.toString();
    if (!timestamp) {
      throw new WebhookVerificationError(
        'Timestamp is required for verification',
      );
    }
    return isValidSlackRequest({
      signingSecret: this.secret,
      body: payloadString,
      headers: {
        'x-slack-signature': signature,
        'x-slack-request-timestamp': timestamp,
      },
    });
  }

  async receive(request: WebhookRequest): Promise<WebhookResponse | void> {
    const signature = request.headers['x-slack-signature'] as string;
    const timestamp = Number(request.headers['x-slack-request-timestamp']);

    if (!signature || !timestamp) {
      throw new WebhookVerificationError(
        'Slack signature or timestamp not found in headers',
      );
    }

    const valid = await this.verify(request.body, signature, timestamp);
    if (!valid) {
      throw new WebhookVerificationError('Invalid signature');
    }

    const body = JSON.parse(request.body.toString());

    if (body.ssl_check) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true }),
        payload: body,
      };
    }

    // Handle URL verification challenge
    if (body?.type === 'url_verification') {
      return {
        statusCode: 200,
        body: JSON.stringify({ challenge: body.challenge }),
        payload: body,
      };
    }

    // TODO: Build out a more robust event dispatcher
    // that can provide the full context to the callbacks.
    // This is a simplified version for now.

    const eventType = body?.event?.type;
    const command = body?.command;
    const actionId = body?.actions?.[0]?.action_id;
    const shortcutId = body?.shortcut_id;
    const dialogCallbackId = body?.callback_id;

    if (eventType && this.callbacks[eventType]) {
      this.callbacks[eventType].forEach(cb => cb(body));
    } else if (command && this.callbacks[`command_${command}`]) {
      this.callbacks[`command_${command}`].forEach(cb => cb(body));
    } else if (actionId && this.callbacks[`action_${actionId}`]) {
      this.callbacks[`action_${actionId}`].forEach(cb => cb(body));
    } else if (shortcutId && this.callbacks[`shortcut_${shortcutId}`]) {
      this.callbacks[`shortcut_${shortcutId}`].forEach(cb => cb(body));
    } else if (
      dialogCallbackId &&
      this.callbacks[`dialog_${dialogCallbackId}`]
    ) {
      this.callbacks[`dialog_${dialogCallbackId}`].forEach(cb => cb(body));
    } else if (this.callbacks.message) {
      // Fallback for general messages
      this.callbacks.message.forEach(cb => cb(body));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
      payload: body,
    };
  }

  on(event: string, listener: (...args: any[]) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    if (this.callbacks[event]) {
      this.callbacks[event].push(listener);
    } else {
      this.callbacks[event] = [listener];
    }
    return this;
  }

  onMessage(callback: (args: MessageCallbackArgs) => Promise<void>) {
    if (this.callbacks.message) {
      this.callbacks.message.push(callback);
    } else {
      this.callbacks.message = [callback as any];
    }
  }

  onCommand(
    command: string,
    callback: (args: {
      command: SlashCommand;
      context: Context & StringIndexed;
      say: SayFn;
      ack: AckFn<string | RespondArguments>;
      body: SlashCommand;
      respond: RespondFn;
    }) => Promise<void>,
  ) {
    const key = `command_${command}`;
    if (this.callbacks[key]) {
      this.callbacks[key].push(callback);
    } else {
      this.callbacks[key] = [callback as any];
    }
  }

  onAction(
    actionId: string,
    callback: (args: {
      action: BlockElementAction | InteractiveAction;
      context: Context & StringIndexed;
      ack: AckFn<string | SayArguments> | AckFn<void>;
      body: SlackAction;
      respond: RespondFn;
    }) => Promise<void>,
  ) {
    const key = `action_${actionId}`;
    if (this.callbacks[key]) {
      this.callbacks[key].push(callback);
    } else {
      this.callbacks[key] = [callback as any];
    }
  }

  onDialogSubmission(
    dialogCallbackId: string,
    callback: (args: {
      dialog: DialogSubmitAction;
      context: Context & StringIndexed;
      ack: AckFn<string | SayArguments> | AckFn<void> | AckFn<DialogValidation>;
      body: SlackAction;
      respond: RespondFn;
    }) => Promise<void>,
  ) {
    const key = `dialog_${dialogCallbackId}`;
    if (this.callbacks[key]) {
      this.callbacks[key].push(callback);
    } else {
      this.callbacks[key] = [callback as any];
    }
  }

  onShortcut(
    shortcutId: string,
    callback: (args: {
      shortcut: SlackShortcut;
      context: Context & StringIndexed;
      ack: AckFn<void>;
      body: SlackShortcut;
      respond: RespondFn;
    }) => Promise<void>,
  ) {
    const key = `shortcut_${shortcutId}`;
    if (this.callbacks[key]) {
      this.callbacks[key].push(callback);
    } else {
      this.callbacks[key] = [callback as any];
    }
  }

  onEvent(
    eventType: string,
    callback: (args: {
      event: KnownEventFromType<string>;
      context: Context & StringIndexed;
      body: EnvelopedEvent<KnownEventFromType<string>>;
    }) => Promise<void>,
  ) {
    if (this.callbacks[eventType]) {
      this.callbacks[eventType].push(callback);
    } else {
      this.callbacks[eventType] = [callback as any];
    }
  }
}
