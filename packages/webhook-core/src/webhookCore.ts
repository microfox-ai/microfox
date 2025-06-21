export class WebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookVerificationError';
  }
}

export interface WebhookRequest {
  headers: Record<string, string | string[] | undefined>;
  body: string | Buffer; // Adjusted to Buffer as well, as some SDKs expect it
}

export interface WebhhookEvent {
  eventId: string;
  eventType: string;
  timestamp: number;
  baseType: 'message' | 'opened';
  text?: string;
  cleanText?: string;
  blocks: any;
  provider: string;
  sender?: {
    id: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
    mobile?: string;
  };
  bot?: {
    id: string; // app_id, bot_id, etc.
    appId?: string;
    botName?: string; // bot_name
    isBotMentioned?: boolean;
  };
  team?: {
    id: string;
  };
  org?: {
    id: string;
  };
  channel: {
    id: string;
    type?: string; // direct_message, public_channel, private_channel, user_to_user
  };
  event: {
    id: string;
    msgId?: string;
    text?: string;
    timestamp?: string; // in fractions of a second
  };
  originalPayload?: any;
}

export interface WebhookResponse {
  statusCode: number;
  body: string;
  payload?: any;
  isTracked?: boolean;
  webhookEvent?: WebhhookEvent;
}

export abstract class Webhook<
  TEventMap extends Record<string, any> = Record<string, any>,
> {
  protected secret: string;

  constructor(options: { secret: string }) {
    if (!options.secret) {
      throw new Error('Webhook secret is required.');
    }
    this.secret = options.secret;
  }

  abstract sign(payload: string | Buffer): Promise<string> | string;

  abstract verify(
    payload: string | Buffer,
    signature: string,
  ): Promise<boolean> | boolean;

  abstract on<E extends keyof TEventMap>(
    event: E,
    listener: (payload: TEventMap[E]) => void,
  ): this;
  abstract on(event: 'error', listener: (error: Error) => void): this;
  abstract on(event: string, listener: (...args: any[]) => void): this;

  abstract receive(request: WebhookRequest): Promise<WebhookResponse | void>;
}
