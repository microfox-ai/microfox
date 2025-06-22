import { z } from 'zod';

export const ActorSchema = z.object({
  id: z.string().describe('Unique identifier of the actor'),
  name: z.string().describe('Name of the actor'),
  username: z.string().describe('Username of the actor owner'),
  createdAt: z.string().datetime().describe('Date when the actor was created'),
  modifiedAt: z.string().datetime().describe('Date when the actor was last modified'),
  // Add more fields as needed
}).describe('Represents an Apify actor');

export const VersionSchema = z.object({
  versionNumber: z.string().describe('Version number of the actor'),
  buildTag: z.string().describe('Build tag of the version'),
  sourceType: z.enum(['SOURCE_FILES', 'TARBALL', 'GIT_REPO']).describe('Type of the source code'),
  sourceCode: z.string().optional().describe('Source code of the version'),
  // Add more fields as needed
}).describe('Represents a version of an Apify actor');

export const EnvVarSchema = z.object({
  name: z.string().describe('Name of the environment variable'),
  value: z.string().describe('Value of the environment variable'),
  isSecret: z.boolean().describe('Whether the environment variable is secret'),
}).describe('Represents an environment variable');

export const BuildSchema = z.object({
  id: z.string().describe('Unique identifier of the build'),
  actId: z.string().describe('ID of the actor this build belongs to'),
  status: z.enum(['READY', 'BUILDING', 'FAILED']).describe('Status of the build'),
  startedAt: z.string().datetime().describe('Date when the build started'),
  finishedAt: z.string().datetime().optional().describe('Date when the build finished'),
  // Add more fields as needed
}).describe('Represents a build of an Apify actor');

export const RunSchema = z.object({
  id: z.string().describe('Unique identifier of the run'),
  actId: z.string().describe('ID of the actor this run belongs to'),
  status: z.enum(['READY', 'RUNNING', 'SUCCEEDED', 'FAILED', 'TIMED_OUT', 'CANCELED']).describe('Status of the run'),
  startedAt: z.string().datetime().describe('Date when the run started'),
  finishedAt: z.string().datetime().optional().describe('Date when the run finished'),
  // Add more fields as needed
}).describe('Represents a run of an Apify actor');

export const DatasetSchema = z.object({
  id: z.string().describe('Unique identifier of the dataset'),
  name: z.string().optional().describe('Name of the dataset'),
  createdAt: z.string().datetime().describe('Date when the dataset was created'),
  modifiedAt: z.string().datetime().describe('Date when the dataset was last modified'),
  // Add more fields as needed
}).describe('Represents an Apify dataset');

export const KeyValueStoreSchema = z.object({
  id: z.string().describe('Unique identifier of the key-value store'),
  name: z.string().optional().describe('Name of the key-value store'),
  createdAt: z.string().datetime().describe('Date when the key-value store was created'),
  modifiedAt: z.string().datetime().describe('Date when the key-value store was last modified'),
  // Add more fields as needed
}).describe('Represents an Apify key-value store');

export const RecordSchema = z.object({
  key: z.string().describe('Key of the record'),
  value: z.unknown().describe('Value of the record'),
  contentType: z.string().optional().describe('Content type of the record'),
}).describe('Represents a record in a key-value store');

export const RequestQueueSchema = z.object({
  id: z.string().describe('Unique identifier of the request queue'),
  name: z.string().optional().describe('Name of the request queue'),
  createdAt: z.string().datetime().describe('Date when the request queue was created'),
  modifiedAt: z.string().datetime().describe('Date when the request queue was last modified'),
  // Add more fields as needed
}).describe('Represents an Apify request queue');

export const WebhookSchema = z.object({
  id: z.string().describe('Unique identifier of the webhook'),
  name: z.string().describe('Name of the webhook'),
  url: z.string().url().describe('URL where the webhook will send requests'),
  eventTypes: z.array(z.string()).describe('Types of events that trigger the webhook'),
  // Add more fields as needed
}).describe('Represents an Apify webhook');

export const UserSchema = z.object({
  id: z.string().describe('Unique identifier of the user'),
  username: z.string().describe('Username of the user'),
  email: z.string().email().describe('Email of the user'),
  // Add more fields as needed
}).describe('Represents an Apify user');

export const PaginationSchema = z.object({
  total: z.number().describe('Total number of items'),
  offset: z.number().describe('Offset of the current page'),
  limit: z.number().describe('Limit of items per page'),
  count: z.number().describe('Number of items on the current page'),
  desc: z.boolean().optional().describe('Whether the items are sorted in descending order'),
}).describe('Represents pagination information');

export const ErrorSchema = z.object({
  type: z.string().describe('Type of the error'),
  message: z.string().describe('Error message'),
}).describe('Represents an error response from the Apify API');
