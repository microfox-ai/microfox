import { Redis } from '@upstash/redis';

export interface IPaginationStatus<T> {
  status: 'running' | 'completed' | 'idle' | 'paused' | 'failed';
  progress: T;
  lastUpdatedAt: number;
  startedAt: number;
  error?: Record<string, any> | string;
}

export class Paginator<T extends Record<string, any>> {
  private redis: Redis;
  private id: string;
  private key: string;

  constructor(redis: Redis, id: string) {
    if (!redis) {
      throw new Error('Redis client must be provided.');
    }
    if (!id) {
      throw new Error('Paginator ID must be provided.');
    }
    this.redis = redis;
    this.id = id;
    this.key = `paginator:${this.id}`;
  }

  public async startNewIndexing(
    initialProgress: T
  ): Promise<IPaginationStatus<T>> {
    const now = Date.now();
    const newStatus: IPaginationStatus<T> = {
      status: 'running',
      progress: initialProgress,
      startedAt: now,
      lastUpdatedAt: now,
    };

    await this.redis.hset(this.key, {
      ...newStatus,
      progress: JSON.stringify(newStatus.progress),
    });
    return newStatus;
  }

  public async updateIndexingStatus(
    newProgress: Partial<T>
  ): Promise<IPaginationStatus<T>> {
    const currentStatus = await this.getCurrentStatus();
    if (!currentStatus) {
      throw new Error(
        `Paginator with id "${this.id}" has not been started. Call start() first.`
      );
    }

    const updatedProgress = { ...currentStatus.progress, ...newProgress };

    const newStatus: Partial<IPaginationStatus<T>> = {
      progress: updatedProgress,
      lastUpdatedAt: Date.now(),
    };

    await this.redis.hset(this.key, {
      progress: JSON.stringify(newStatus.progress),
      lastUpdatedAt: newStatus.lastUpdatedAt,
    });

    return { ...currentStatus, ...newStatus, progress: updatedProgress };
  }

  public async completeIndexing(): Promise<IPaginationStatus<T>> {
    const currentStatus = await this.getCurrentStatus();
    if (!currentStatus) {
      throw new Error(
        `Paginator with id "${this.id}" has not been started. Call start() first.`
      );
    }

    const newStatus: Partial<IPaginationStatus<T>> = {
      status: 'completed',
      lastUpdatedAt: Date.now(),
    };

    await this.redis.hset(this.key, {
      status: newStatus.status,
      lastUpdatedAt: newStatus.lastUpdatedAt,
    });

    return { ...currentStatus, ...newStatus };
  }

  public async pauseIndexing(): Promise<IPaginationStatus<T>> {
    return this.updateStatus('paused');
  }

  public async resumeIndexing(): Promise<IPaginationStatus<T>> {
    return this.updateStatus('running');
  }

  public async failIndexing(
    error: Record<string, any> | string
  ): Promise<IPaginationStatus<T>> {
    const currentStatus = await this.getCurrentStatus();
    if (!currentStatus) {
      throw new Error(
        `Paginator with id "${this.id}" has not been started. Call start() first.`
      );
    }

    const newStatus: Partial<IPaginationStatus<T>> = {
      status: 'failed',
      lastUpdatedAt: Date.now(),
      error: error,
    };

    await this.redis.hset(this.key, {
      status: newStatus.status,
      lastUpdatedAt: newStatus.lastUpdatedAt,
      error: JSON.stringify(newStatus.error),
    });

    return { ...currentStatus, ...newStatus };
  }

  public async getCurrentStatus(): Promise<IPaginationStatus<T> | null> {
    const status = await this.redis.hgetall(this.key);
    if (!status) {
      return null;
    }

    const parsedStatus: any = { ...status };
    if (status.progress) {
      parsedStatus.progress = JSON.parse(status.progress as string);
    }
    if (status.error) {
      parsedStatus.error = JSON.parse(status.error as string);
    }
    parsedStatus.lastUpdatedAt = Number(status.lastUpdatedAt);
    parsedStatus.startedAt = Number(status.startedAt);

    return parsedStatus as IPaginationStatus<T>;
  }

  public async isStale(timeoutSeconds: number): Promise<boolean> {
    const status = await this.getCurrentStatus();
    if (
      !status ||
      status.status === 'completed' ||
      status.status === 'failed'
    ) {
      return false;
    }

    const timeoutMilliseconds = timeoutSeconds * 1000;
    const sinceLastUpdate = Date.now() - status.lastUpdatedAt;

    return sinceLastUpdate > timeoutMilliseconds;
  }

  public async resetIndexing(): Promise<void> {
    await this.redis.del(this.key);
  }

  private async updateStatus(
    newStatusValue: IPaginationStatus<T>['status']
  ): Promise<IPaginationStatus<T>> {
    const currentStatus = await this.getCurrentStatus();
    if (!currentStatus) {
      throw new Error(
        `Paginator with id "${this.id}" has not been started. Call start() first.`
      );
    }

    const newStatus: Partial<IPaginationStatus<T>> = {
      status: newStatusValue,
      lastUpdatedAt: Date.now(),
    };

    await this.redis.hset(this.key, {
      status: newStatus.status,
      lastUpdatedAt: newStatus.lastUpdatedAt,
    });

    return { ...currentStatus, ...newStatus };
  }
}
