import dotenv from 'dotenv';
import { sdkInit } from './sdkInit.js';
import { SQSEvent } from 'aws-lambda';
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

export const handler = async (event: SQSEvent): Promise<any> => {
  for (const record of event.Records) {
    console.log('handler: processing record', { messageId: record.messageId });
    const body = JSON.parse(record.body);
    console.log('Processing message:', body);
    const { triggerEvent, task_id } = body;

    await taskHandler.updateTask(task_id, {
      status: TaskState.Working,
    });

    try {
      // Extract environment variables from the new structure
      toolHandler.populateEnvs({ event: triggerEvent });

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
      await taskHandler.updateTask(task_id, {
        status: TaskState.Completed,
        metadata: {
          result: JSON.stringify(result),
        },
      });
      // Return successful response
      return createApiResponse(200, result);
    } catch (error) {
      console.error('Error in handler:', error);

      // Handle custom API errors
      if (error instanceof ApiError) {
        return createApiResponse(error.statusCode, { error: error.message });
      }

      // Handle unexpected errors
      const internalError = new InternalServerError(
        error instanceof Error ? error.message : String(error),
      );
      return createApiResponse(internalError.statusCode, {
        error: internalError.message,
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
};
