import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { APIGatewayEvent } from 'aws-lambda';
import { createApiResponse, ApiError, InternalServerError, ProcessTask, ToolParse } from '@microfox/tool-core';
import path from 'path';
import * as fs from 'fs';

const sqsClient = new SQSClient({ region: process.env.AWS_REGION ?? 'us-east-1' });

const toolHandler = new ToolParse({
  encryptionKey: process.env.ENCRYPTION_KEY,
});

const taskHandler = new ProcessTask({
  url: process.env.TASK_UPSTASH_REDIS_REST_URL,
  token: process.env.TASK_UPSTASH_REDIS_REST_TOKEN,
});

export const handler = async (event: APIGatewayEvent): Promise<any> => {
  try {
    if (event.path === '/docs.json' && event.httpMethod === 'GET') {
      try {
        const openapiPath = path.resolve(__dirname, 'openapi.json');
        const openapiSpec = fs.readFileSync(openapiPath, 'utf-8');
        return createApiResponse(200, JSON.parse(openapiSpec));
      } catch (error) {
        console.error('Error reading openapi.json:', error);
        const internalError = new InternalServerError(
          'Could not load API specification.',
        );
        return createApiResponse(internalError.statusCode, {
          error: internalError.message,
        });
      }
    }

    // Extract environment variables from the new structure
    toolHandler.populateEnvVars(event);

    const queueUrl = process.env.PUPPETEER_QUEUE_URL;
    if (!queueUrl) {
      throw new InternalServerError('SQS queue URL not configured.');
    }

    const task = await taskHandler.createTask({
      type: 'package-sls',
      metadata: {
        packageName: 'puppeteer-sls',
        functionName: event.path.substring(1),
        triggerEvent: event,
      },
    });

    const messageBody = {
      triggerEvent: event,
      task_id: task.id,
    };

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody),
    });

    await sqsClient.send(command);

    return createApiResponse(202, { message: 'Request accepted for processing.', task_id: task.id });
  } catch (error) {
    console.error('Error in proxy handler:', error);

    if (error instanceof ApiError) {
      return createApiResponse(error.statusCode, { error: error.message });
    }

    const internalError = new InternalServerError(
      error instanceof Error ? error.message : String(error),
    );
    return createApiResponse(internalError.statusCode, {
      error: internalError.message,
    });
  }
}; 