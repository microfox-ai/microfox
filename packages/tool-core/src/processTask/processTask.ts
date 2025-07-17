import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';
import { CrudHash } from '@microfox/db-upstash';
import { randomUUID } from 'crypto';
import { Task, TaskState, AgentTask, AgentTaskEvent } from '@microfox/types';

dotenv.config();

export type ProcessTaskOptions = {
  url?: string;
  token?: string;
  redis?: Redis;
};

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
  private crud: CrudHash<ProcessTaskType>;

  constructor(options: ProcessTaskOptions = {}) {
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
    this.crud = new CrudHash<ProcessTaskType>(redis, 'task');
  }

  async create(
    metadata?: any,
    sendUpdate: boolean = true,
    isClientUpdate: boolean = true
  ): Promise<ProcessTaskType> {
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
    if (sendUpdate) {
      await this.sendUpdate({
        taskId,
        isClientUpdate: isClientUpdate || true,
        event: 'update',
        state: TaskState.Submitted,
        data: { metadata: { ...metadata } },
      });
    }
    return task;
  }

  async get(taskId: string): Promise<ProcessTaskType | null> {
    const task = await this.crud.get(taskId);
    if (!task) {
      return null;
    }
    return task as ProcessTaskType;
  }

  async update({
    taskId,
    state,
    data = {},
    sendUpdate = true,
    isClientUpdate = true,
  }: AgentTask & {
    sendUpdate?: boolean;
    isClientUpdate?: boolean;
  }): Promise<ProcessTaskType> {
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
    if (sendUpdate) {
      const event =
        state === TaskState.Completed
          ? 'complete'
          : state === TaskState.Failed
            ? 'failed'
            : 'update';
      await this.sendUpdate({
        taskId,
        isClientUpdate: isClientUpdate || true,
        event,
        state,
        data: {
          metadata: { ...task.metadata, ...metadata },
          response: { ...task.response, ...response },
          error: { ...task.error, ...error },
        },
      });
    }
    return updatedTask;
  }

  async sendUpdate({
    taskId,
    isClientUpdate = true,
    event,
    data,
  }: AgentTask & {
    isClientUpdate: boolean;
    event?: 'update' | 'complete' | 'failed';
  }): Promise<void> {
    let updateEventData: AgentTaskEvent = {
      taskId,
      event: event || 'update',
      state: TaskState.Unknown,
    };
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
            updateEventData = {
              taskId,
              event: 'complete',
              state: TaskState.Completed,
              response: task.response,
              metadata: task.metadata,
            };
            break;
          case 'failed':
            updateEventData = {
              taskId,
              event: 'failed',
              state: TaskState.Failed,
              error: task.error,
            };
            break;
          default:
            updateEventData = {
              taskId,
              event: 'update',
              state: task.status.state,
              metadata: task.metadata,
            };
            break;
        }
      }
    }
    const protectionKey = process.env.TASK_API_PROTECTION_KEY;
    const url = `${process.env.TASK_API_BASE_URL}/task/${taskId}`;
    if (!process.env.TASK_API_BASE_URL) {
      console.log(
        'TASK_API_BASE_URL is not set, skipping task update broadcast.'
      );
      return;
    }

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-task-protection-key': protectionKey ?? '',
        },
        body: JSON.stringify({
          data: { ...updateEventData, updatedAt: new Date().toISOString() },
          event,
          isClientUpdate,
        }),
      });
    } catch (error) {
      console.error('Failed to send task update via POST request:', error);
    }
  }
}
