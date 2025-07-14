import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';
import { Crud } from '@microfox/db-upstash';
import { randomUUID } from 'crypto';
import { Task, TaskState } from '@microfox/types';

dotenv.config();

export type ProcessTaskOptions = {
  url?: string;
  token?: string;
  redis?: Redis;
}

export interface ProcessTaskType extends Task {
  response?: {
    [key: string]: any;
  };
  error?: {
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export class ProcessTask {
  private crud: Crud<ProcessTaskType>;

  constructor(
    options: ProcessTaskOptions = {}
  ) {
    let redis: Redis;
    if (options.redis) {
      redis = options.redis;
    } else {
      const url = options.url ?? process.env.TASK_UPSTASH_REDIS_REST_URL;
      const token = options.token ?? process.env.TASK_UPSTASH_REDIS_REST_TOKEN;

      if (url && token) {
        redis = new Redis({ url, token });
      } else {
        throw new Error(
          'Redis client not initialized. Please provide a Redis instance, or credentials in the constructor, or set TASK_UPSTASH_REDIS_REST_URL and TASK_UPSTASH_REDIS_REST_TOKEN environment variables.'
        );
      }
    }
    this.crud = new Crud<ProcessTaskType>(redis, 'task');
  }

  async create(metadata?: any): Promise<ProcessTaskType> {
    const taskId = [
      process.env.MICROFOX_BOT_PROJECT_ID,
      process.env.MICROFOX_CLIENT_REQUEST_ID,
      randomUUID(),
    ]
      .filter(Boolean)
      .join('-');

    const task: ProcessTaskType = {
      id: taskId,
      contextId: taskId,
      status: {
        state: TaskState.Submitted,
      },
      metadata: {
        ...metadata,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      kind: 'task',
    };

    await this.crud.set(taskId, task);
    return task;
  }

  async get(taskId: string): Promise<ProcessTaskType | null> {
    const task = await this.crud.get(taskId);
    if (!task) {
      return null;
    }
    return task as ProcessTaskType;
  }

  async update(
    taskId: string,
    state: TaskState,
    data: {
      metadata?: Record<string, any>;
      response?: Record<string, any>;
      error?: Record<string, any>;
    } = {},
  ): Promise<ProcessTaskType> {
    const task = await this.crud.get(taskId);
    if (!task) {
      throw new Error(`Task with id "${taskId}" not found.`);
    }
    const { metadata, response, error } = data;

    const updatedTask: ProcessTaskType = {
      ...task,
      status: {
        state,
      },
      ...(metadata && { metadata: { ...task.metadata, ...metadata } }),
      ...(response && { response: { ...task.response, ...response } }),
      ...(error && { error: { ...task.error, ...error } }),
      updatedAt: new Date().toISOString(),
    };

    await this.crud.set(taskId, updatedTask);
    return updatedTask;
  }

  async sendUpdate(
    taskId: string,
    isClientUpdate: boolean = true,
    event?: 'update' | 'complete' | 'failed',
    data?: {
      state: TaskState;
      metadata?: Record<string, any>;
      response?: Record<string, any>;
      error?: Record<string, any>;
    },
  ): Promise<void> {
    if (event && data !== undefined) {
      // event and data are provided, no need to fetch task
    } else {
      const task = await this.get(taskId);
      if (!task) {
        console.warn(`Task with id "${taskId}" not found for sending update.`);
        return;
      }

      if (!event) {
        switch (task.status.state) {
          case TaskState.Completed:
            event = 'complete';
            break;
          case TaskState.Failed:
            event = 'failed';
            break;
          default:
            event = 'update';
            break;
        }
      }

      if (data === undefined) {
        switch (event) {
          case 'complete':
            data = { state: TaskState.Completed, response: task.response, metadata: task.metadata };
            break;
          case 'failed':
            data = { state: TaskState.Failed, error: task.error };
            break;
          default:
            data = { state: task.status.state, metadata: task.metadata };
            break;
        }
      }
    }

    const url = `${process.env.BASE_SERVER_URL}/api/background-tasks/trigger`;
    if (!process.env.BASE_SERVER_URL) {
      console.warn(
        'BASE_SERVER_URL is not set, skipping task update broadcast.',
      );
      return;
    }

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          event,
          taskId,
          isClientUpdate,
        }),
      });
    } catch (error) {
      console.error('Failed to send task update via POST request:', error);
    }
  }
}
