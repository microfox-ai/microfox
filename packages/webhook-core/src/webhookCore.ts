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

export interface WebhookEvent {
  event_id: string;
  event_type: string;
  timestamp: number;
  base_type: 'message' | 'opened';
  text?: string;
  clean_text?: string;
  blocks: any;
  provider: string;
  sender?: {
    id: string;
    name?: string;
    email?: string;
    avatar_url?: string;
    mobile?: string;
  };
  bot?: {
    id: string; // app_id, bot_id, etc.
    app_id?: string;
    bot_name?: string; // bot_name
    is_bot_mentioned?: boolean;
  };
  provider_info?: {
    team?: {
      id: string;
    };
    org?: {
      id: string;
    };
  };
  channel: {
    id: string;
    type?: string; // direct_message, public_channel, private_channel, user_to_user
  };
  event: {
    id: string;
    type?: string; // message, opened, etc.
    subtype?: string; // channel_join, channel_leave, etc.
    msg_id?: string;
    task_id?: string;
    metadata?: Record<string, any>;
    parent_msg_id?: string;
    text?: string;
    ts?: string; // in fractions of a second
    parent_ts?: string; // in fractions of a second
  };
  original_payload?: any;
}

export interface WebhookResponse {
  statusCode: number;
  body: string;
  payload?: any;
  isTracked?: boolean;
  webhookEvent?: WebhookEvent;
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
