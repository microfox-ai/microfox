import { z } from 'zod';

export interface GitHubSDKOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface ConnectGitHubRepositoryParams {
  spaceId: string;
  repo: string;
  branch?: string;
  webhookEvents?: string[];
}

export interface DisconnectGitHubRepositoryParams {
  integrationId: string;
}

export interface GetConnectedRepositoriesParams {
  spaceId: string;
}

export interface IntegrationDetails {
  id: string;
  spaceId: string;
  repo: string;
  branch: string;
  webhookEvents: string[];
  createdAt: string;
  updatedAt: string;
}

export const connectGitHubRepositoryParamsSchema = z.object({
  spaceId: z.string().describe('The ID of the GitBook space'),
  repo: z.string().describe('The full name of the GitHub repository (e.g., "owner/repo")'),
  branch: z.string().optional().describe('The branch to connect (default: "main")'),
  webhookEvents: z.array(z.string()).optional().describe('List of webhook events to subscribe to'),
});

export const disconnectGitHubRepositoryParamsSchema = z.object({
  integrationId: z.string().describe('The ID of the integration to disconnect'),
});

export const getConnectedRepositoriesParamsSchema = z.object({
  spaceId: z.string().describe('The ID of the GitBook space'),
});

export const integrationDetailsSchema = z.object({
  id: z.string().describe('The unique identifier of the integration'),
  spaceId: z.string().describe('The ID of the GitBook space'),
  repo: z.string().describe('The full name of the GitHub repository'),
  branch: z.string().describe('The connected branch'),
  webhookEvents: z.array(z.string()).describe('List of subscribed webhook events'),
  createdAt: z.string().describe('The creation date of the integration'),
  updatedAt: z.string().describe('The last update date of the integration'),
});

export type ConnectGitHubRepositoryParamsType = z.infer<typeof connectGitHubRepositoryParamsSchema>;
export type DisconnectGitHubRepositoryParamsType = z.infer<typeof disconnectGitHubRepositoryParamsSchema>;
export type GetConnectedRepositoriesParamsType = z.infer<typeof getConnectedRepositoriesParamsSchema>;
export type IntegrationDetailsType = z.infer<typeof integrationDetailsSchema>;
