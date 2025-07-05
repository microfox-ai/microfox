import { WhatsAppWebhook } from './WhatsAppWebhook';
import { WhatsAppMessage } from './types';
import express from 'express';
import serverless from 'serverless-http';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';

type MessageCallback = (message: WhatsAppMessage) => void;

export class WhatsAppWebhookSdk {
  private webhook: WhatsAppWebhook;
  private app: express.Express;
  private messageCallbacks: MessageCallback[] = [];

  constructor(verifyToken?: string) {
    this.webhook = new WhatsAppWebhook({ verifyToken });
    this.app = express();
    this.app.use(express.json());

    this.app.get('/webhook', (req, res) => {
      const challenge = this.webhook.verifyGetRequest(req.query);
      if (challenge) {
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    });

    this.app.post('/webhook', (req, res) => {
      this.webhook.process(req.body);
      res.sendStatus(200);
    });

    this.webhook.on('message', (message) => {
      this.messageCallbacks.forEach(callback => callback(message));
    });
  }

  public onMessage(callback: MessageCallback) {
    this.messageCallbacks.push(callback);
  }

  public async handleEvent(
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> {
    const handler = serverless(this.app);
    return (await handler(event, context)) as APIGatewayProxyResult;
  }
} 