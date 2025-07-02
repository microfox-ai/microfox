import type { WebhookEvent } from "./webhookEvent";

// Based on prisma model ClientSecret
export type ClientSecret = {
  id: string;
  botProjectId: string;
  clientRequestIds: string[];
  userId: string;
  name: string;
  type: string;
  variables: any[];
  createdAt: Date;
  updatedAt: Date;
  status: string;
  botConfig: any[];
  clientDeploymentIds: string[];
  packageConstructor?: string | null;
  packageName?: string | null;
  packageType?: string | null;
  isHidden?: boolean | null;
  templateId?: string | null;
  tokenResponse?: any | null;
  identityMetadata?: any | null;
  identityUserId?: string | null;
  identityTeamId?: string | null;
  identityOrgId?: string | null;
  awsRegion?: string | null;
};

export type MicrofoxConnection = {
  microfox_bot_id: string;
  related_users: {
    microfox_user_id: string;
    provider: string;
    [key: string]: any;
  }[];
  related_secrets: ClientSecret[];
};

export type ReactAccess = {
  access_token: string;
};

export type WebhookSqsPayload = {
  task_type: "direct";
  channel?: string;
  webhook_event?: WebhookEvent;
  microfox_connections: MicrofoxConnection[];
  react_access: ReactAccess;
}; 