import { z } from 'zod';
import { LinkedInOAuthSdk, LinkedInScope } from '@microfox/linkedin-oauth';

const ErrorSchema = z.object({
  message: z.string(),
  serviceErrorCode: z.number(),
  status: z.number(),
});

const ChangelogEventSchema = z
  .object({
    id: z.number(),
    capturedAt: z.number(),
    processedAt: z.number(),
    configVersion: z.number(),
    owner: z.string(),
    actor: z.string(),
    resourceName: z.string(),
    resourceId: z.string(),
    resourceUri: z.string(),
    method: z.enum(['CREATE', 'UPDATE', 'PARTIAL_UPDATE', 'DELETE']),
    methodName: z.string().optional(),
    activity: z.record(z.string(), z.unknown()),
    processedActivity: z.record(z.string(), z.unknown()),
    siblingActivities: z.array(z.record(z.string(), z.unknown())),
    parentSiblingActivities: z.array(z.record(z.string(), z.unknown())),
    activityId: z.string(),
    activityStatus: z.enum(['SUCCESS', 'FAILURE', 'SUCCESSFUL_REPLAY']),
  })
  .describe('Changelog event schema');

const MemberSnapshotSchema = z
  .object({
    snapshotDomain: z.string(),
    snapshotData: z.record(z.string(), z.unknown()),
  })
  .describe('Member snapshot schema');

const MemberComplianceAuthorizationSchema = z
  .object({
    regulatedAt: z.number(),
    memberComplianceAuthorizationKey: z.object({
      developerApplication: z.string(),
      member: z.string(),
    }),
    memberComplianceScopes: z.array(z.string()),
  })
  .describe('Member compliance authorization schema');

export class LinkedInDataPortabilitySDK {
  private oauthSdk: LinkedInOAuthSdk;
  private accessToken: string;
  private baseUrl = 'https://api.linkedin.com/v2';

  constructor(config: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    accessToken: string;
    refreshToken?: string;
  }) {
    this.oauthSdk = new LinkedInOAuthSdk({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      scopes: [LinkedInScope.OFFLINE_ACCESS, 'r_dma_portability_3rd_party'],
    });
    this.accessToken = config.accessToken;
  }

  private async request<T>(
    endpoint: string,
    method: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202312',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `LinkedIn API error: ${response.status} ${response.statusText}: ${error.message}`,
      );
    }

    return response.json();
  }

  async validateAccessToken(): Promise<void> {
    try {
      const result = await this.oauthSdk.validateAccessToken(this.accessToken);
      if (!result.isValid) {
        throw new Error('Invalid access token');
      }
    } catch (error) {
      throw new Error(
        `Failed to validate access token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    try {
      const result = await this.oauthSdk.refreshAccessToken(refreshToken);
      this.accessToken = result.accessToken;
      return result;
    } catch (error) {
      throw new Error(
        `Failed to refresh access token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getMemberChangeLogs(
    startTime?: number,
  ): Promise<z.infer<typeof ChangelogEventSchema>[]> {
    await this.validateAccessToken();
    const params: Record<string, string> = { q: 'memberAndApplication' };
    if (startTime) {
      params.startTime = startTime.toString();
    }
    const response = await this.request<z.infer<typeof ChangelogEventSchema>[]>(
      '/rest/memberChangeLogs',
      'GET',
      params,
    );
    return z.array(ChangelogEventSchema).parse(response);
  }

  async getMemberSnapshotData(
    domain?: string,
  ): Promise<z.infer<typeof MemberSnapshotSchema>[]> {
    await this.validateAccessToken();
    const params: Record<string, string> = { q: 'criteria' };
    if (domain) {
      params.domain = domain;
    }
    const response = await this.request<z.infer<typeof MemberSnapshotSchema>[]>(
      '/rest/memberSnapshotData',
      'GET',
      params,
    );
    return z.array(MemberSnapshotSchema).parse(response);
  }

  async getMemberAuthorizations(): Promise<
    z.infer<typeof MemberComplianceAuthorizationSchema>
  > {
    await this.validateAccessToken();
    const response = await this.request<
      z.infer<typeof MemberComplianceAuthorizationSchema>
    >('/rest/memberAuthorizations', 'GET', { q: 'memberAndApplication' });
    return MemberComplianceAuthorizationSchema.parse(response);
  }

  async triggerMemberDataProcessing(): Promise<{ success: boolean }> {
    await this.validateAccessToken();
    const response = await this.request<{ success: boolean }>(
      '/rest/memberAuthorizations',
      'POST',
    );
    return z.object({ success: z.boolean() }).parse(response);
  }
}

export const createLinkedInSDK = (config: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken: string;
  refreshToken?: string;
}): LinkedInDataPortabilitySDK => {
  return new LinkedInDataPortabilitySDK(config);
};

export { LinkedInScope };
