import {
  type AckFn,
  type BlockElementAction,
  type Context,
  type DialogSubmitAction,
  type DialogValidation,
  type EnvelopedEvent,
  type InteractiveAction,
  isValidSlackRequest,
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
import App from '@slack/bolt/dist/App';
import AwsLambdaReceiver from '@slack/bolt/dist/receivers/AwsLambdaReceiver';
import {
  type AwsCallback,
  type AwsEvent,
  type AwsResponse,
} from '@slack/bolt/dist/receivers/AwsLambdaReceiver';
import { type AllMessageEvents } from './types';
import NextJsReceiver from './NextJsReceiver';
import type { NextApiRequest, NextApiResponse } from 'next/types';

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

/**
 * Type for the response to a URL verification challenge
 */
export type ChallengeResponse = {
  challenge: string;
};

/**
 * SlackWebhookSdk - A class for handling Slack webhooks
 */
export class SlackWebhookSdk {
  private secret?: string;
  private botToken?: string;
  private app: App<StringIndexed>;
  private awsLambdaReceiver?: AwsLambdaReceiver;
  private nextJsReceiver?: NextJsReceiver;

  /**
   * Creates an instance of SlackWebhookSdk.
   * @param {string} secret - The secret used for verifying webhook signatures
   */
  constructor(
    secret?: string,
    botToken?: string,
    type: 'aws' | 'nextjs' = 'nextjs',
  ) {
    this.secret = secret ?? process.env.SLACK_SIGNING_SECRET;
    this.botToken = botToken ?? process.env.SLACK_BOT_TOKEN;
    if (!this.secret) {
      throw new Error('Secret is required');
    }
    if (!this.botToken) {
      throw new Error('Bot token is required');
    }
    if (type === 'aws') {
      this.awsLambdaReceiver = new AwsLambdaReceiver({
        signingSecret: this.secret,
      });
    } else {
      this.nextJsReceiver = new NextJsReceiver({
        signingSecret: this.secret,
      });
    }
    this.app = new App({
      token: botToken,
      receiver: this.awsLambdaReceiver,
    });
  }

  onMessage(
    calbback: (args: {
      message: AllMessageEvents;
      context: Context & StringIndexed;
      say: SayFn;
      body: EnvelopedEvent<AllMessageEvents>;
    }) => Promise<void>,
  ) {
    this.app.message(async ({ message, say, client, context, body }) => {
      calbback({ body, message, context, say });
    });
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
    this.app.message(
      pattern,
      async ({ message, say, client, context, body }) => {
        calbback({ body, message, context, say });
      },
    );
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
    this.app.command(
      command,
      async ({ command, say, ack, respond, client, context, body }) => {
        await calbback({ body, command, context, say, ack, respond });
      },
    );
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
    this.app.action(
      actionId,
      async ({ action, ack, respond, client, context, body }) => {
        await calbback({
          body,
          action: action as BlockElementAction | InteractiveAction,
          context,
          ack: ack as AckFn<string | SayArguments> | AckFn<void>,
          respond,
        });
      },
    );
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
    this.app.action(
      {
        callback_id: dialogCallbackId,
      },
      async ({ action, ack, respond, client, context, body }) => {
        await calbback({
          body,
          dialog: action as DialogSubmitAction,
          context,
          ack,
          respond,
        });
      },
    );
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
    this.app.shortcut(
      shortcutId,
      async ({ shortcut, ack, respond, context, body }) => {
        await calbback({ body, shortcut, context, ack, respond });
      },
    );
  }

  onEvent(
    eventType: string,
    calbback: (args: {
      event: KnownEventFromType<string>;
      context: Context & StringIndexed;
      body: EnvelopedEvent<KnownEventFromType<string>>;
    }) => Promise<void>,
  ) {
    this.app.event(eventType, async ({ event, context, body }) => {
      await calbback({ body, event, context });
    });
  }

  /**
   * Verifies the signature of the incoming webhook
   * @param {string} payload - The raw payload string
   * @param {string} headers - The headers from the webhook request
   * @returns {boolean} - True if the signature is valid, false otherwise
   */
  private verifySignature(
    payload: string,
    headers: {
      'x-slack-signature': string;
      'x-slack-request-timestamp': number;
    },
  ): boolean {
    if (!this.secret) {
      throw new Error('Secret is required');
    }
    return isValidSlackRequest({
      signingSecret: this.secret,
      body: payload,
      headers: headers,
    });
  }

  /**
   * Handles incoming webhooks from Slack
   * @param event - The event object from the AWS Lambda function
   * @param context - The context object from the AWS Lambda function
   * @param callback - The callback function from the AWS Lambda function
   * @returns The response from the AWS Lambda function
   */
  async handleNextJs(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    // Verify the signature
    await this.nextJsReceiver?.handleRequest(req, res);
  }

  /**
   * Handles incoming webhooks from Slack
   * @param event - The event object from the AWS Lambda function
   * @param context - The context object from the AWS Lambda function
   * @param callback - The callback function from the AWS Lambda function
   * @returns The response from the AWS Lambda function
   */
  async handleAwsEvent(
    event: AwsEvent,
    context: any,
    callback: AwsCallback,
  ): Promise<AwsResponse> {
    // Verify the signature
    const rawBody = JSON.stringify(event.body);
    if (
      !this.verifySignature(rawBody, {
        'x-slack-signature': event.headers['x-slack-signature'] ?? '',
        'x-slack-request-timestamp':
          Number(event.headers['x-slack-request-timestamp']) ?? 0,
      })
    ) {
      throw new WebhookVerificationError('Invalid webhook signature');
    }
    // Handle URL verification challenge
    // if (requestBody.type === 'url_verification') {
    //   // Cast to our specific type for URL verification
    //   const verificationRequestBody = requestBody as UrlVerificationRequestBody;
    //   // Validate that challenge is a string before returning
    //   if (typeof verificationRequestBody.challenge === 'string') {
    //     return { challenge: verificationRequestBody.challenge };
    //   }
    //   throw new WebhookParseError(
    //     'Failed to parse URL verification challenge: challenge property is not a string or is missing',
    //   );
    // }

    // Parse the event
    const handler = await this.awsLambdaReceiver?.start();
    if (!handler) {
      throw new Error('Failed to start AWS Lambda receiver');
    }
    return handler(event, context, callback);
  }
}
