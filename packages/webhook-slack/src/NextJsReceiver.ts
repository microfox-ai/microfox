import {
  type Receiver,
  type ReceiverEvent,
  ReceiverMultipleAckError,
  type ReceiverProcessEventErrorHandlerArgs,
  type ReceiverUnhandledRequestHandlerArgs,
  HTTPModuleFunctions as httpFunc,
  isValidSlackRequest,
} from '@slack/bolt';
import App from '@slack/bolt/dist/App.js';
import { HTTPResponseAck } from '@slack/bolt/dist/receivers/HTTPResponseAck.js';
import { ConsoleLogger, type LogLevel, type Logger } from '@slack/logger';
import type { NextApiRequest, NextApiResponse } from 'next';

type CustomPropertiesExtractor = (
  request: NextApiRequest,
  // biome-ignore lint/suspicious/noExplicitAny: custom properties can be anything
) => Record<string, any>;

export interface NextJsReceiverOptions {
  signingSecret: string | (() => PromiseLike<string>);
  logger?: Logger;
  logLevel?: LogLevel;
  path?: string;
  signatureVerification?: boolean;
  processBeforeResponse?: boolean;
  customPropertiesExtractor?: CustomPropertiesExtractor;
  processEventErrorHandler?: (
    args: ReceiverProcessEventErrorHandlerArgs,
  ) => Promise<boolean>;
  unhandledRequestHandler?: (args: ReceiverUnhandledRequestHandlerArgs) => void;
  unhandledRequestTimeoutMillis?: number;
  invalidRequestSignatureHandler?: (args: {
    rawBody: string;
    signature: string;
    ts: number;
    req: NextApiRequest;
    res: NextApiResponse;
  }) => void;
}

export default class NextJsReceiver implements Receiver {
  private app: App | undefined;
  private logger: Logger;
  private signingSecretProvider: string | (() => PromiseLike<string>);
  private signatureVerification: boolean;
  private processBeforeResponse: boolean;
  private path: string;
  private unhandledRequestTimeoutMillis: number;
  private customPropertiesExtractor: CustomPropertiesExtractor;
  private processEventErrorHandler: (
    args: ReceiverProcessEventErrorHandlerArgs,
  ) => Promise<boolean>;
  private unhandledRequestHandler: (
    args: ReceiverUnhandledRequestHandlerArgs,
  ) => void;
  private invalidRequestSignatureHandler: (args: {
    rawBody: string;
    signature: string;
    ts: number;
    req: NextApiRequest;
    res: NextApiResponse;
  }) => void;

  public constructor(options: NextJsReceiverOptions) {
    this.signatureVerification = options.signatureVerification ?? true;
    this.signingSecretProvider = options.signingSecret;
    this.customPropertiesExtractor =
      options.customPropertiesExtractor !== undefined
        ? options.customPropertiesExtractor
        : _ => ({});
    this.path = options.path ?? '/slack/events';
    this.unhandledRequestTimeoutMillis =
      options.unhandledRequestTimeoutMillis ?? 3001;
    this.logger =
      options.logger ??
      (() => {
        const defaultLogger = new ConsoleLogger();
        if (options.logLevel) {
          defaultLogger.setLevel(options.logLevel);
        }
        return defaultLogger;
      })();

    this.processBeforeResponse = options.processBeforeResponse ?? false;
    this.processEventErrorHandler =
      options.processEventErrorHandler ??
      httpFunc.defaultProcessEventErrorHandler;
    this.unhandledRequestHandler =
      options.unhandledRequestHandler ??
      httpFunc.defaultUnhandledRequestHandler;
    this.invalidRequestSignatureHandler =
      options.invalidRequestSignatureHandler ??
      this.defaultInvalidRequestSignatureHandler;
  }

  private _signingSecret: string | undefined;

  private async signingSecret(): Promise<string> {
    if (this._signingSecret === undefined) {
      this._signingSecret =
        typeof this.signingSecretProvider === 'string'
          ? this.signingSecretProvider
          : await this.signingSecretProvider();
    }
    return this._signingSecret;
  }

  public init(app: App): void {
    this.app = app;
  }

  public async handleRequest(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> {
    this.logger.debug(`Incoming request: ${JSON.stringify(req.body, null, 2)}`);

    const rawBody = this.getRawBody(req);
    const body = this.parseRequestBody(
      rawBody,
      req.headers['content-type'],
      this.logger,
    );

    // Handle SSL checks
    if (body?.ssl_check) {
      res.status(200).json({ ok: true });
      return;
    }

    // Handle URL verification
    if (body?.type === 'url_verification') {
      res.status(200).json({ challenge: body.challenge });
      return;
    }

    // Verify request signature
    if (this.signatureVerification) {
      const signature = req.headers['x-slack-signature'] as string;
      const ts = Number(req.headers['x-slack-request-timestamp']);

      if (
        !this.isValidRequestSignature(
          await this.signingSecret(),
          rawBody,
          signature,
          ts,
        )
      ) {
        this.invalidRequestSignatureHandler({
          rawBody,
          signature,
          ts,
          req,
          res,
        });
        res.status(401).end();
        return;
      }
    }

    // Setup ack timeout warning
    let isAcknowledged = false;
    const noAckTimeoutId = setTimeout(() => {
      if (!isAcknowledged) {
        this.logger.error(
          `An incoming event was not acknowledged within ${this.unhandledRequestTimeoutMillis} ms. Ensure that the ack() argument is called in a listener.`,
        );
      }
    }, this.unhandledRequestTimeoutMillis);

    const ack = new HTTPResponseAck({
      logger: this.logger,
      processBeforeResponse: this.processBeforeResponse,
      unhandledRequestHandler: this.unhandledRequestHandler,
      unhandledRequestTimeoutMillis: this.unhandledRequestTimeoutMillis,
      httpRequest: req,
      httpResponse: res,
    });

    // Structure the ReceiverEvent
    const event: ReceiverEvent = {
      body,
      ack: async response => {
        if (isAcknowledged) {
          throw new ReceiverMultipleAckError();
        }
        isAcknowledged = true;
        clearTimeout(noAckTimeoutId);
        if (typeof response === 'undefined' || response == null) {
          ack.storedResponse = '';
        } else {
          ack.storedResponse = response;
        }
      },
      retryNum: Number(req.headers['x-slack-retry-num']),
      retryReason: req.headers['x-slack-retry-reason'] as string,
      customProperties: this.customPropertiesExtractor(req),
    };

    // Send the event to the app for processing
    try {
      await this.app?.processEvent(event);
      if (ack.storedResponse !== undefined) {
        if (typeof ack.storedResponse === 'string') {
          res.status(200).send(ack.storedResponse);
        } else {
          res.status(200).json(ack.storedResponse);
        }
      }
    } catch (error) {
      this.logger.error(
        'An unhandled error occurred while Bolt processed an event',
      );
      this.logger.debug(
        `Error details: ${error}, storedResponse: ${ack.storedResponse}`,
      );
      res.status(500).send('Internal server error');
    }
  }

  private getRawBody(req: NextApiRequest): string {
    if (typeof req.body === 'string') {
      return req.body;
    }
    return JSON.stringify(req.body);
  }

  private parseRequestBody(
    stringBody: string,
    contentType: string | string[] | undefined,
    logger: Logger,
  ): any {
    const contentTypeStr = Array.isArray(contentType)
      ? contentType[0]
      : contentType;

    if (contentTypeStr === 'application/json') {
      return JSON.parse(stringBody);
    }

    logger.warn(`Unexpected content-type detected: ${contentTypeStr}`);
    try {
      return JSON.parse(stringBody);
    } catch (e) {
      logger.error(
        `Failed to parse body as JSON data for content-type: ${contentTypeStr}`,
      );
      throw e;
    }
  }

  private isValidRequestSignature(
    signingSecret: string,
    body: string,
    signature: string,
    requestTimestamp: number,
  ): boolean {
    if (!signature || !requestTimestamp) {
      return false;
    }

    // Divide current date to match Slack ts format
    // Subtract 5 minutes from current time
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
    if (requestTimestamp < fiveMinutesAgo) {
      return false;
    }

    return isValidSlackRequest({
      signingSecret,
      body,
      headers: {
        'x-slack-signature': signature,
        'x-slack-request-timestamp': requestTimestamp,
      },
    });
  }

  private defaultInvalidRequestSignatureHandler(args: {
    rawBody: string;
    signature: string;
    ts: number;
    req: NextApiRequest;
    res: NextApiResponse;
  }): void {
    const { signature, ts } = args;
    this.logger.info(
      `Invalid request signature detected (X-Slack-Signature: ${signature}, X-Slack-Request-Timestamp: ${ts})`,
    );
  }

  // These methods are required by the Receiver interface but not used in Next.js
  public start(): Promise<void> {
    return Promise.resolve();
  }

  public stop(): Promise<void> {
    return Promise.resolve();
  }
}
