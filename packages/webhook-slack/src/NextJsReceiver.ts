import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import querystring from 'node:querystring';
import {
  type App,
  type BufferedIncomingMessage,
  type CodedError,
  HTTPResponseAck,
  type InstallProviderOptions,
  type InstallURLOptions,
  type Receiver,
  type ReceiverEvent,
  ReceiverInconsistentStateError,
  ReceiverMultipleAckError,
  type ReceiverProcessEventErrorHandlerArgs,
  type ReceiverUnhandledRequestHandlerArgs,
  HTTPModuleFunctions as httpFunc,
} from '@slack/bolt';
import { ConsoleLogger, type LogLevel, type Logger } from '@slack/logger';
import {
  type CallbackOptions,
  type InstallPathOptions,
  InstallProvider,
} from '@slack/oauth';

type CustomPropertiesExtractor = (
  request: NextApiRequest,
  // biome-ignore lint/suspicious/noExplicitAny: custom properties can be anything
) => Record<string, any>;

export interface InstallerOptions {
  stateStore?: InstallProviderOptions['stateStore']; // default ClearStateStore
  stateVerification?: InstallProviderOptions['stateVerification']; // defaults true
  authVersion?: InstallProviderOptions['authVersion']; // default 'v2'
  metadata?: InstallURLOptions['metadata'];
  installPath?: string;
  directInstall?: boolean; // see https://api.slack.com/start/distributing/directory#direct_install
  renderHtmlForInstallPath?: (url: string) => string;
  redirectUriPath?: string;
  installPathOptions?: InstallPathOptions;
  callbackOptions?: CallbackOptions;
  userScopes?: InstallURLOptions['userScopes'];
  clientOptions?: InstallProviderOptions['clientOptions'];
  authorizationUrl?: InstallProviderOptions['authorizationUrl'];
}

export interface NextJsReceiverOptions {
  signingSecret: string | (() => PromiseLike<string>);
  logger?: Logger;
  logLevel?: LogLevel;
  path?: string;
  signatureVerification?: boolean;
  processBeforeResponse?: boolean;
  clientId?: string;
  clientSecret?: string;
  stateSecret?: InstallProviderOptions['stateSecret']; // required when using default stateStore
  redirectUri?: string;
  installationStore?: InstallProviderOptions['installationStore']; // default MemoryInstallationStore
  scopes?: InstallURLOptions['scopes'];
  installerOptions?: InstallerOptions;
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
  private installer: InstallProvider | undefined;
  private installerOptions: InstallerOptions | undefined;
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

    this.installerOptions = options.installerOptions;
    if (
      this.installerOptions &&
      this.installerOptions.installPath === undefined
    ) {
      this.installerOptions.installPath = '/slack/install';
    }
    if (
      this.installerOptions &&
      this.installerOptions.redirectUriPath === undefined
    ) {
      this.installerOptions.redirectUriPath = '/slack/oauth_redirect';
    }
    if (options.clientId && options.clientSecret) {
      this.installer = new InstallProvider({
        ...this.installerOptions,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        stateSecret: options.stateSecret,
        installationStore: options.installationStore,
        logger: options.logger,
        logLevel: options.logLevel,
        installUrlOptions: {
          scopes: options.scopes ?? [],
          userScopes: this.installerOptions?.userScopes,
          metadata: this.installerOptions?.metadata,
          redirectUri: options.redirectUri,
        },
      });
    }
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

    if (contentTypeStr === 'application/x-www-form-urlencoded') {
      const parsedBody = querystring.parse(stringBody);
      if (typeof parsedBody.payload === 'string') {
        return JSON.parse(parsedBody.payload);
      }
      return parsedBody;
    }
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

    const hmac = crypto.createHmac('sha256', signingSecret);
    const [version, hash] = signature.split('=');
    hmac.update(`${version}:${requestTimestamp}:${body}`);
    const computedHash = hmac.digest('hex');

    // Timing-safe string comparison
    if (hash.length !== computedHash.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < hash.length; i++) {
      result |= hash.charCodeAt(i) ^ computedHash.charCodeAt(i);
    }
    return result === 0;
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

  public async handleInstall(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> {
    if (!this.installer || !this.installerOptions?.installPath) {
      res.status(404).end();
      return;
    }
    await this.installer.handleInstallPath(
      req,
      res,
      this.installerOptions.installPathOptions,
    );
  }

  public async handleCallback(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> {
    if (!this.installer || !this.installerOptions?.redirectUriPath) {
      res.status(404).end();
      return;
    }
    await this.installer.handleCallback(
      req,
      res,
      this.installerOptions.callbackOptions,
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
