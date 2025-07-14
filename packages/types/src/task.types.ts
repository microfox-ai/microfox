// https://a2aproject.github.io/A2A/latest/specification/#761-gettaskpushnotificationconfigparams-object-taskspushnotificationconfigget

import { JSONRPCRequest, ListTaskPushNotificationConfigParams } from "./a2a.types";
import { Artifact, Message } from "./message.types";

export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Server-generated id for contextual alignment across interactions */
  contextId: string;
  /** Current status of the task */
  status: TaskStatus;
  history?: Message[];
  /** Collection of artifacts created by the agent. */
  artifacts?: Artifact[];
  /** Extension metadata. */
  metadata?: {
    [key: string]: any;
  };
  /** Event type */
  kind: 'task';
}

/** TaskState and accompanying message. */
export interface TaskStatus {
  state: TaskState;
  /** Additional status updates for client */
  message?: Message;
  /**
   * ISO 8601 datetime string when the status was recorded.
   * @TJS-examples ["2023-10-27T10:00:00Z"]
   * */
  timestamp?: string;
}

/** Represents the possible states of a Task. */
export enum TaskState {
  Submitted = 'submitted',
  Working = 'working',
  InputRequired = 'input-required',
  Completed = 'completed',
  Canceled = 'canceled',
  Failed = 'failed',
  Rejected = 'rejected',
  AuthRequired = 'auth-required',
  Unknown = 'unknown',
}

/** Sent by server during sendStream or subscribe requests */
export interface TaskStatusUpdateEvent {
  /** Task id */
  taskId: string;
  /** The context the task is associated with */
  contextId: string;
  /** Event type */
  kind: 'status-update';
  /** Current status of the task */
  status: TaskStatus;
  /** Indicates the end of the event stream */
  final: boolean;
  /** Extension metadata. */
  metadata?: {
    [key: string]: any;
  };
}

/** Sent by server during sendStream or subscribe requests */
export interface TaskArtifactUpdateEvent {
  /** Task id */
  taskId: string;
  /** The context the task is associated with */
  contextId: string;
  /** Event type */
  kind: 'artifact-update';
  /** Generated artifact */
  artifact: Artifact;
  /** Indicates if this artifact appends to a previous one */
  append?: boolean;
  /** Indicates if this is the last chunk of the artifact */
  lastChunk?: boolean;
  /** Extension metadata. */
  metadata?: {
    [key: string]: any;
  };
}

/** Parameters for querying a task, including optional history length. */
export interface TaskQueryParams extends TaskIdParams {
  /** Number of recent messages to be retrieved. */
  historyLength?: number;
}

/** Parameters containing only a task ID, used for simple task operations. */
export interface TaskIdParams {
  /** Task id. */
  id: string;
  metadata?: {
    [key: string]: any;
  };
}

/** Parameters for fetching a pushNotificationConfiguration associated with a Task */
export interface GetTaskPushNotificationConfigParams extends TaskIdParams {
  pushNotificationConfigId?: string;
}

/**
 * JSON-RPC request model for the 'tasks/pushNotificationConfig/list' method.
 */
export interface ListTaskPushNotificationConfigRequest extends JSONRPCRequest {
  id: number | string;
  /** A String containing the name of the method to be invoked. */
  method: 'tasks/pushNotificationConfig/list';
  /** A Structured value that holds the parameter values to be used during the invocation of the method. */
  params: ListTaskPushNotificationConfigParams;
}

/** Parameters for removing pushNotificationConfiguration associated with a Task */
export interface DeleteTaskPushNotificationConfigParams extends TaskIdParams {
  pushNotificationConfigId: string;
}

/**Configuration for setting up push notifications for task updates. */
export interface PushNotificationConfig {
  /** Push Notification ID - created by server to support multiple callbacks */
  id?: string;
  /** URL for sending the push notifications. */
  url: string;
  /** Token unique to this task/session. */
  token?: string;
  authentication?: PushNotificationAuthenticationInfo;
}

/** Defines authentication details for push notifications. */
export interface PushNotificationAuthenticationInfo {
  /** Supported authentication schemes - e.g. Basic, Bearer */
  schemes: string[];
  /** Optional credentials */
  credentials?: string;
}

/**Parameters for setting or getting push notification configuration for a task */
export interface TaskPushNotificationConfig {
  /** Task id. */
  taskId: string;
  /** Push notification configuration. */
  pushNotificationConfig: PushNotificationConfig;
}
