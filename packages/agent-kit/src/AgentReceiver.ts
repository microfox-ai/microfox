import { EnvelopedEvent, SlackWebhookSdk } from '@microfox/webhook-slack';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export class AgentReceiver {
  private source: 'slack' | 'octokit' | 'whatsapp' = 'slack';
  private options: {
    clientId?: string;
    clientSecret?: string;
    webhookSecret: string;
    webhookUrl?: string;
  };

  constructor(
    _source: 'slack' | 'octokit' | 'whatsapp',
    options: {
      clientId?: string;
      clientSecret?: string;
      webhookSecret: string;
      webhookUrl?: string;
    },
  ) {
    this.source = _source;
    this.options = options;
  }

  async receiveEvents(body: APIGatewayProxyEvent): Promise<{
    response: APIGatewayProxyResult;
    payload?: EnvelopedEvent;
  }> {
    const rawBody = body.body;
    const headers = body.headers;

    if (!rawBody) {
      return {
        response: {
          statusCode: 500,
          body: JSON.stringify({ error: 'No body found' }),
        },
      };
    }

    if (this.source === 'slack') {
      const slackWebhookSdk = new SlackWebhookSdk(this.options.webhookSecret);
      return await slackWebhookSdk.verifyAndParseRequest(rawBody, headers);
    }

    if (this.source === 'octokit') {
    }

    return {
      response: {
        statusCode: 200,
        body: JSON.stringify({ ok: true }),
      },
    };
  }
}
