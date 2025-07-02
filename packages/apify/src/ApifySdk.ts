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
} from './schemas';
import {
Actor,
Version,
EnvVar,
Build,
Run,
Dataset,
KeyValueStore,
Record,
RequestQueue,
Webhook,
User,
Pagination,
} from './types';

const BASE_URL = 'https://api.apify.com/v2';

class CustomApifyError extends Error {
constructor(public status: number, message: string) {
super(message);
this.name = 'CustomApifyError';
}
}

export class ApifySdk {
private apiToken: string;

constructor(options: { apiToken?: string }) {
this.apiToken = options.apiToken || process.env.APIFY_API_TOKEN || '';
if (!this.apiToken) {
throw new Error('API token is required. Please provide it in the constructor or set the APIFY_API_TOKEN environment variable.');
}
}

private async request<T>(
endpoint: string,
method: string,
body?: unknown,
queryParams?: { [key: string]: any }
): Promise<T> {
const url = new URL(`${BASE_URL}${endpoint}`);
if (queryParams) {
Object.entries(queryParams).forEach(([key, value]) => {
  url.searchParams.append(key, (value as any).toString());
});
}

const headers: HeadersInit = {
'Authorization': `Bearer ${this.apiToken}`,
'Content-Type': 'application/json',
};

const response = await fetch(url.toString(), {
method,
headers,
body: body ? JSON.stringify(body) : undefined,
});

if (!response.ok) {
const errorData = await response.json();
throw new CustomApifyError(response.status, errorData.error?.message || 'Unknown error');
}

const data = await response.json();
return data.data as T;
}

// Users
async getCurrentUser(): Promise<User> {
return this.request<User>('/users/me', 'GET');
}

// Actors
async listActors(params?: {
my?: boolean;
offset?: number;
limit?: number;
desc?: boolean;
sortBy?: 'createdAt' | 'lastRunStartedAt';
}): Promise<Pagination<Actor>> {
return this.request<Pagination<Actor>>('/acts', 'GET', undefined, { key: 'options', value: params });
}

async createActor(actor: Omit<Actor, 'id'>): Promise<Actor> {
return this.request<Actor>('/acts', 'POST', actor);
}

async getActor(actorId: string): Promise<Actor> {
return this.request<Actor>(`/acts/${actorId}`, 'GET');
}

async updateActor(actorId: string, actor: Partial<Actor>): Promise<Actor> {
return this.request<Actor>(`/acts/${actorId}`, 'PUT', actor);
}

async deleteActor(actorId: string): Promise<void> {
await this.request<void>(`/acts/${actorId}`, 'DELETE');
}

// Actor Versions
async listActorVersions(actorId: string): Promise<Version[]> {
return this.request<Version[]>(`/acts/${actorId}/versions`, 'GET');
}

async createActorVersion(actorId: string, version: Omit<Version, 'id'>): Promise<Version> {
return this.request<Version>(`/acts/${actorId}/versions`, 'POST', version);
}

async getActorVersion(actorId: string, versionNumber: string): Promise<Version> {
return this.request<Version>(`/acts/${actorId}/versions/${versionNumber}`, 'GET');
}

async updateActorVersion(actorId: string, versionNumber: string, version: Partial<Version>): Promise<Version> {
return this.request<Version>(`/acts/${actorId}/versions/${versionNumber}`, 'PUT', version);
}

async deleteActorVersion(actorId: string, versionNumber: string): Promise<void> {
await this.request<void>(`/acts/${actorId}/versions/${versionNumber}`, 'DELETE');
}

// Actor Builds
async listActorBuilds(actorId: string, params?: {
offset?: number;
limit?: number;
desc?: boolean;
}): Promise<Pagination<Build>> {
return this.request<Pagination<Build>>(`/acts/${actorId}/builds`, 'GET', undefined, { key: 'options', value: params });
}

async createActorBuild(actorId: string, build: Omit<Build, 'id'>): Promise<Build> {
return this.request<Build>(`/acts/${actorId}/builds`, 'POST', build);
}

async getActorBuild(actorId: string, buildId: string): Promise<Build> {
return this.request<Build>(`/acts/${actorId}/builds/${buildId}`, 'GET');
}

// Actor Runs
async listActorRuns(actorId: string, params?: {
offset?: number;
limit?: number;
desc?: boolean;
status?: string;
}): Promise<Pagination<Run>> {
return this.request<Pagination<Run>>(`/acts/${actorId}/runs`, 'GET', undefined, { key: 'options', value: params });
}

async runActor(actorId: string, runOptions: Partial<Run>): Promise<Run> {
return this.request<Run>(`/acts/${actorId}/runs`, 'POST', runOptions);
}

async getActorRun(actorId: string, runId: string): Promise<Run> {
return this.request<Run>(`/acts/${actorId}/runs/${runId}`, 'GET');
}

// Datasets
async listDatasets(params?: {
offset?: number;
limit?: number;
desc?: boolean;
unnamed?: boolean;
}): Promise<Pagination<Dataset>> {
return this.request<Pagination<Dataset>>('/datasets', 'GET', undefined, { key: 'options', value: params });
}

async createDataset(dataset: Omit<Dataset, 'id'>): Promise<Dataset> {
return this.request<Dataset>('/datasets', 'POST', dataset);
}

async getDataset(datasetId: string): Promise<Dataset> {
return this.request<Dataset>(`/datasets/${datasetId}`, 'GET');
}

async updateDataset(datasetId: string, dataset: Partial<Dataset>): Promise<Dataset> {
return this.request<Dataset>(`/datasets/${datasetId}`, 'PUT', dataset);
}

async deleteDataset(datasetId: string): Promise<void> {
await this.request<void>(`/datasets/${datasetId}`, 'DELETE');
}

// Key-Value Stores
async listKeyValueStores(params?: {
offset?: number;
limit?: number;
desc?: boolean;
unnamed?: boolean;
}): Promise<Pagination<KeyValueStore>> {
return this.request<Pagination<KeyValueStore>>('/key-value-stores', 'GET', undefined, { key: 'options', value: params });
}

async createKeyValueStore(store: Omit<KeyValueStore, 'id'>): Promise<KeyValueStore> {
return this.request<KeyValueStore>('/key-value-stores', 'POST', store);
}

async getKeyValueStore(storeId: string): Promise<KeyValueStore> {
return this.request<KeyValueStore>(`/key-value-stores/${storeId}`, 'GET');
}

async updateKeyValueStore(storeId: string, store: Partial<KeyValueStore>): Promise<KeyValueStore> {
return this.request<KeyValueStore>(`/key-value-stores/${storeId}`, 'PUT', store);
}

async deleteKeyValueStore(storeId: string): Promise<void> {
await this.request<void>(`/key-value-stores/${storeId}`, 'DELETE');
}

// Key-Value Store Records
async listKeyValueStoreRecords(storeId: string, params?: {
exclusiveStartKey?: string;
limit?: number;
}): Promise<Record[]> {
return this.request<Record[]>(`/key-value-stores/${storeId}/keys`, 'GET', undefined, { key: 'options', value: params });
}

async getRecord(storeId: string, key: string): Promise<Record> {
return this.request<Record>(`/key-value-stores/${storeId}/records/${key}`, 'GET');
}

async setRecord(storeId: string, key: string, value: unknown): Promise<void> {
await this.request<void>(`/key-value-stores/${storeId}/records/${key}`, 'PUT', { value });
}

async deleteRecord(storeId: string, key: string): Promise<void> {
await this.request<void>(`/key-value-stores/${storeId}/records/${key}`, 'DELETE');
}

// Request Queues
async listRequestQueues(params?: {
offset?: number;
limit?: number;
desc?: boolean;
unnamed?: boolean;
}): Promise<Pagination<RequestQueue>> {
return this.request<Pagination<RequestQueue>>('/request-queues', 'GET', undefined, { key: 'options', value: params });
}

async createRequestQueue(queue: Omit<RequestQueue, 'id'>): Promise<RequestQueue> {
return this.request<RequestQueue>('/request-queues', 'POST', queue);
}

async getRequestQueue(queueId: string): Promise<RequestQueue> {
return this.request<RequestQueue>(`/request-queues/${queueId}`, 'GET');
}

async updateRequestQueue(queueId: string, queue: Partial<RequestQueue>): Promise<RequestQueue> {
return this.request<RequestQueue>(`/request-queues/${queueId}`, 'PUT', queue);
}

async deleteRequestQueue(queueId: string): Promise<void> {
await this.request<void>(`/request-queues/${queueId}`, 'DELETE');
}

// Webhooks
async listWebhooks(params?: {
offset?: number;
limit?: number;
desc?: boolean;
}): Promise<Pagination<Webhook>> {
return this.request<Pagination<Webhook>>('/webhooks', 'GET', undefined, { key: 'options', value: params });
}

async createWebhook(webhook: Omit<Webhook, 'id'>): Promise<Webhook> {
return this.request<Webhook>('/webhooks', 'POST', webhook);
}

async getWebhook(webhookId: string): Promise<Webhook> {
return this.request<Webhook>(`/webhooks/${webhookId}`, 'GET');
}

async updateWebhook(webhookId: string, webhook: Partial<Webhook>): Promise<Webhook> {
return this.request<Webhook>(`/webhooks/${webhookId}`, 'PUT', webhook);
}

async deleteWebhook(webhookId: string): Promise<void> {
await this.request<void>(`/webhooks/${webhookId}`, 'DELETE');
}
}

export function createApifySDK(options: { apiToken?: string }): ApifySdk {
return new ApifySdk(options);
}