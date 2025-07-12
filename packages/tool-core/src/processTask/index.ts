import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';
import { Crud } from '@microfox/db-upstash';
import { randomUUID } from 'crypto';

dotenv.config();

export interface Task {
  id: string;
  status: 'created' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  data?: any;
}

export class ProcessTask {
  private crud: Crud<Task>;

  constructor(
    options: {
      url?: string;
      token?: string;
      redis?: Redis;
    } = {}
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
    this.crud = new Crud<Task>(redis, 'task');
  }

  async createTask(data: any): Promise<Task> {
    const taskId = [
      process.env.MICROFOX_BOT_PROJECT_ID,
      process.env.MICROFOX_CLIENT_REQUEST_ID,
      randomUUID(),
    ]
      .filter(Boolean)
      .join('-');

    const task: Task = {
      id: taskId,
      status: 'created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data,
    };

    await this.crud.set(taskId, task);
    return task;
  }

  async updateTask(
    taskId: string,
    updates: Partial<Task>
  ): Promise<Task> {
    const task = await this.crud.get(taskId);
    if (!task) {
      throw new Error(`Task with id "${taskId}" not found.`);
    }

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.crud.set(taskId, updatedTask);
    return updatedTask;
  }
}