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
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { type AllMessageEvents } from './types';

/**
 * Custom error class for webhook verification failures
 */
export class WebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookVerificationError';
  }
}

/**
 * Custom error class for webhook parsing failures
 */
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
 * SlackWebhookSdk - A class for handling Slack webhooks
 */
export class SlackWebhookSdk {
  private secret?: string;
  private botToken?: string;
  private callbacks: Record<string, ((args: any) => Promise<void>)[]> = {};

  /**
   * Creates an instance of SlackWebhookSdk.
   * @param {string} secret - The secret used for verifying webhook signatures
   */
  constructor(secret?: string, botToken?: string) {
    this.secret = secret ?? process.env.SLACK_SIGNING_SECRET;
    this.botToken = botToken ?? process.env.SLACK_BOT_TOKEN;
    if (!this.secret) {
      throw new Error('Secret is required');
    }
    if (!this.botToken) {
      throw new Error('Bot token is required');
    }
  }

  onMessage(calbback: (args: MessageCallbackArgs) => Promise<void>) {
    if (this.callbacks.message) {
      this.callbacks.message.push(calbback);
    } else {
      this.callbacks.message = [calbback];
    }
  }

  onPatternedMessage(
    pattern: string | RegExp,
    calbback: (args: {
      message: AllMessageEvents;
      context: Context & StringIndexed;
      say: SayFn;
      body: EnvelopedEvent<AllMessageEvents>;
    }) => Promise<void>,
  ) {
    if (this.callbacks.message) {
      this.callbacks.message.push(calbback);
    } else {
      this.callbacks.message = [calbback];
    }
  }

  onCommand(
    command: string,
    calbback: (args: {
      command: SlashCommand;
      context: Context & StringIndexed;
      say: SayFn;
      ack: AckFn<string | RespondArguments>;
      body: SlashCommand;
      respond: RespondFn;
    }) => Promise<void>,
  ) {
    if (this.callbacks.command) {
      this.callbacks.command.push(calbback);
    } else {
      this.callbacks.command = [calbback];
    }
  }

  onAction(
    actionId: string,
    calbback: (args: {
      action: BlockElementAction | InteractiveAction;
      context: Context & StringIndexed;
      ack: AckFn<string | SayArguments> | AckFn<void>;
      body: SlackAction;
      respond: RespondFn;
    }) => Promise<void>,
  ) {
    if (this.callbacks.action) {
      this.callbacks.action.push(calbback);
    } else {
      this.callbacks.action = [calbback];
    }
  }

  onDialogSubmission(
    dialogCallbackId: string,
    calbback: (args: {
      dialog: DialogSubmitAction;
      context: Context & StringIndexed;
      ack: AckFn<string | SayArguments> | AckFn<void> | AckFn<DialogValidation>;
      body: SlackAction;
      respond: RespondFn;
    }) => Promise<void>,
  ) {
    if (this.callbacks.dialog) {
      this.callbacks.dialog.push(calbback);
    } else {
      this.callbacks.dialog = [calbback];
    }
  }

  onShortcut(
    shortcutId: string,
    calbback: (args: {
      shortcut: SlackShortcut;
      context: Context & StringIndexed;
      ack: AckFn<void>;
      body: SlackShortcut;
      respond: RespondFn;
    }) => Promise<void>,
  ) {
    if (this.callbacks.shortcut) {
      this.callbacks.shortcut.push(calbback);
    } else {
      this.callbacks.shortcut = [calbback];
    }
  }

  onEvent(
    eventType: string,
    calbback: (args: {
      event: KnownEventFromType<string>;
      context: Context & StringIndexed;
      body: EnvelopedEvent<KnownEventFromType<string>>;
    }) => Promise<void>,
  ) {
    if (this.callbacks.event) {
      this.callbacks.event.push(calbback);
    } else {
      this.callbacks.event = [calbback];
    }
  }

  /**
   * Verifies the signature of the incoming webhook
   * @param {string} payload - The raw payload string
   * @param {string} headers - The headers from the webhook request
   * @returns {boolean} - True if the signature is valid, false otherwise
   */
  verifySignature(
    payload: string,
    headers: {
      'x-slack-signature': string;
      'x-slack-request-timestamp': number;
    },
  ): boolean {
    if (!this.secret) {
      throw new WebhookParseError('Secret is required');
    }
    return isValidSlackRequest({
      signingSecret: this.secret,
      body: payload,
      headers: headers,
    });
  }

  /**
   * Verifies the signature of the incoming webhook and parses the request body
   * @param rawBody - The raw body of the request
   * @param headers - The headers of the request
   * @returns The response and payload of the request
   */
  async verifyAndParseRequest(
    rawBody: string,
    headers: Record<string, string | undefined>,
  ): Promise<{
    response: APIGatewayProxyResult;
    payload: EnvelopedEvent;
  }> {
    if (
      !this.verifySignature(rawBody, {
        'x-slack-signature': headers['x-slack-signature'] ?? '',
        'x-slack-request-timestamp':
          Number(headers['x-slack-request-timestamp']) ?? 0,
      })
    ) {
      throw new WebhookVerificationError('Invalid webhook signature');
    }
    const body = JSON.parse(rawBody);

    if (body?.ssl_check) {
      return {
        response: {
          statusCode: 200,
          body: JSON.stringify({ ok: true }),
        },
        payload: body,
      };
    }

    // Handle URL verification challenge
    if (body?.type === 'url_verification') {
      // Cast to our specific type for URL verification
      const verificationRequestBody = body as {
        challenge: string;
      };
      // Validate that challenge is a string before returning
      if (typeof verificationRequestBody.challenge === 'string') {
        return {
          response: {
            statusCode: 200,
            body: JSON.stringify({
              challenge: verificationRequestBody.challenge,
            }),
          },
          payload: body,
        };
      }
      throw new WebhookParseError(
        'Failed to parse URL verification challenge: challenge property is not a string or is missing',
      );
    }

    const slackEnvelope = body as EnvelopedEvent;

    if (slackEnvelope.type != 'event_callback') {
      throw new WebhookParseError(
        'Invalid webhook type: expected event_callback',
      );
    }

    return {
      response: {
        statusCode: 200,
        body: JSON.stringify({ ok: true }),
      },
      payload: slackEnvelope,
    };
  }
}
