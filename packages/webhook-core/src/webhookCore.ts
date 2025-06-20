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

export interface WebhookResponse {
  statusCode: number;
  body: string;
  payload?: any;
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
