import dotenv from 'dotenv';
import { sdkInit } from './sdkInit.js';
import { SQSEvent, SQSBatchResponse, SQSBatchItemFailure } from 'aws-lambda';
import {
  ToolParse,
  createApiResponse,
  ApiError,
  InternalServerError,
  ProcessTask,
  TaskState,
} from '@microfox/tool-core';

dotenv.config(); // for any local vars

const toolHandler = new ToolParse({
  encryptionKey: process.env.ENCRYPTION_KEY,
});

const taskHandler = new ProcessTask({
  url: process.env.TASK_UPSTASH_REDIS_REST_URL,
  token: process.env.TASK_UPSTASH_REDIS_REST_TOKEN,
});

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const batchItemFailures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    let task_id: string | undefined;
    try {
      console.log('handler: processing record', {
        messageId: record.messageId,
      });
      const body = JSON.parse(record.body);
      console.log('Processing message:', body);
      const { triggerEvent } = body;
      task_id = body.task_id;

      if (!task_id) {
        throw new Error('task_id is missing from the message body');
      }

      // Extract environment variables from the new structure
      toolHandler.populateEnvs({ event: triggerEvent });

      await taskHandler.update({
        taskId: task_id,
        state: TaskState.Working,
        metadata: {
          triggerEvent,
          loader: 'Started the browser',
        },
      });

      const constructorName = toolHandler.extractConstructor(triggerEvent);

      // Map functions
      const sdkMap = sdkInit({
        constructorName,
        ...process.env,
      });

      // Extract function arguments
      const args = toolHandler.extractArguments(triggerEvent);

      // Extract function from the SDK map
      const fn = toolHandler.extractFunction(sdkMap, triggerEvent);

      // Invoke the function
      const result = await toolHandler.executeFunction(fn, args);

      await taskHandler.update({
        taskId: task_id,
        state: TaskState.Completed,
        response: result,
        metadata: {
          loader: 'Completed the task',
        },
      });
    } catch (error) {
      console.error(`Error processing message with id: ${record.messageId}.`, {
        errorMessage: error instanceof Error ? error.message : String(error),
        task_id,
      });
      // Do not push to batchItemFailures to prevent SQS from retrying
      // batchItemFailures.push({ itemIdentifier: record.messageId });

      if (task_id) {
        await taskHandler.update({
          taskId: task_id,
          state: TaskState.Failed,
          error: {
            message: error instanceof Error ? error.message : String(error),
          },
          metadata: {
            loader: 'Failed the task',
          },
        });
      }
    }
  }
  return { batchItemFailures };
};
