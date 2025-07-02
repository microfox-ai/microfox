import { z } from 'zod';
import {
ActorSchema,
VersionSchema,
EnvVarSchema,
BuildSchema,
RunSchema,
DatasetSchema,
KeyValueStoreSchema,
RecordSchema,
RequestQueueSchema,
WebhookSchema,
UserSchema,
PaginationSchema,
ErrorSchema,
} from '../schemas';

export type Actor = z.infer<typeof ActorSchema>;
export type Version = z.infer<typeof VersionSchema>;
export type EnvVar = z.infer<typeof EnvVarSchema>;
export type Build = z.infer<typeof BuildSchema>;
export type Run = z.infer<typeof RunSchema>;
export type Dataset = z.infer<typeof DatasetSchema>;
export type KeyValueStore = z.infer<typeof KeyValueStoreSchema>;
export type Record = z.infer<typeof RecordSchema>;
export type RequestQueue = z.infer<typeof RequestQueueSchema>;
export type Webhook = z.infer<typeof WebhookSchema>;
export type User = z.infer<typeof UserSchema>;
export type Pagination<T> = z.infer<typeof PaginationSchema> & { items: T[] };

export interface ApifyError extends Error {
  statusCode: number;
}

export class ApifyError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApifyError';
  }
}