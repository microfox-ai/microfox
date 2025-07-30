import { CrudHash } from '@microfox/db-upstash';
import { Redis } from '@upstash/redis';
import {
  CreateVerificationPayload,
  WhatsAppVerification,
  WhatsappOAuthConfig,
  whatsappOAuthConfigSchema,
  createVerificationPayloadSchema,
  whatsappVerificationSchema
} from './types';

const WHATSAPP_VERIFICATION_CODE_EXPIRATION_TIME_MS = 5 * 60 * 1000; // 5 minutes

export class WhatsappOAuthSdk {
  private apiBaseUrl: string;
  private crud: CrudHash<WhatsAppVerification>;
  private redis: Redis;

  constructor(config: WhatsappOAuthConfig) {
    const validatedConfig = whatsappOAuthConfigSchema.parse(config);
    this.apiBaseUrl = validatedConfig.apiBaseUrl ?? process.env.WHATSAPP_APP_BASE_URL ?? '';

    if (validatedConfig.redis) {
      this.redis = validatedConfig.redis;
    } else {
      const url = validatedConfig.upstashRedisRestUrl
        ?? process.env.WHATSAPP_REDIS_URL;
      const token = validatedConfig.upstashRedisRestToken
        ?? process.env.WHATSAPP_REDIS_TOKEN;

      if (!url || !token) {
        throw new Error("Redis connection details were not provided. Please provide a Redis instance or connection details in the config or environment variables.");
      }
      this.redis = new Redis({ url, token });
    }

    this.crud = new CrudHash<WhatsAppVerification>(
      this.redis,
      'whatsapp-verification'
    );
  }

  public getWidgetUrl(
    clientSecretId: string,
  ): string {
    const params = new URLSearchParams({
      clientSecretId,
    });
    return `${this.apiBaseUrl}/widget/whatsapp?${params.toString()}`;
  }

  async createVerification(payload: CreateVerificationPayload & { metadata?: any }): Promise<WhatsAppVerification> {
    const validatedPayload = createVerificationPayloadSchema.parse({
      ...payload,
      id: `${payload.userId}-${payload.clientSecretId}-${payload.code}`,
      code: payload.code,
      createdAt: new Date(),
      verified: false,
      metadata: payload.metadata,
    });
    const verification = await this.crud.set(
      validatedPayload.id!,
      validatedPayload as WhatsAppVerification,
      { ttl: WHATSAPP_VERIFICATION_CODE_EXPIRATION_TIME_MS / 1000 }
    );
    return whatsappVerificationSchema.parse(verification);
  }

  async getVerification(code: string): Promise<WhatsAppVerification | null> {
    const records = await this.crud.query(`@code:[${code} ${code}]`);
    if (!records || records.length === 0) {
      console.log('No verification code found');
      return null;
    } else if (records.length > 1) {
      console.log('Multiple verification codes found');
      return null;
    }
    return records[0];
  }

  async deleteVerification(id: string): Promise<void> {
    await this.crud.del(id);
  }

  async markAsVerified(id: string): Promise<WhatsAppVerification> {
    const updated = await this.crud.update(id, { verified: true });
    return updated;
  }

  async updatePhoneNumber(id: string, phoneNumber: string): Promise<WhatsAppVerification> {
    const updated = await this.crud.update(id, { phoneNumber });
    return updated;
  }

  async addOrUpdateMetadata(id: string, metadata: any): Promise<WhatsAppVerification> {
    const updated = await this.crud.update(id, { metadata });
    return updated;
  }

  public async processVerification(message: string): Promise<{ isVerified?: boolean; record?: WhatsAppVerification }> {
    try {
      const code = this.extractVerificationCode(message);
      if (!code) {
        return { isVerified: false };
      }
      const record = await this.getVerification(code);
      if (!record) {
        return { isVerified: false };
      }
      const isExpired =
        record.createdAt < new Date(Date.now() - WHATSAPP_VERIFICATION_CODE_EXPIRATION_TIME_MS);
      if (isExpired) {
        await this.deleteVerification(record.id);
        return { isVerified: false };
      }
      if (record.code === code) {
        await this.markAsVerified(record.id);
        return { isVerified: true, record };
      }
      return { isVerified: false };
    } catch (error) {
      console.error('Error in processVerification', error);
      return { isVerified: false };
    }
  }

  public async setupWebhookHandshakeSubscription(
    accessToken: string,
    businessAccountId: string
  ): Promise<void> {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${businessAccountId}/subscribed_apps`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to setup webhook subscription: ${response.statusText}`);
    }
  }

  public async exchangeCodeForUserIdentity(code: string): Promise<any> {
    const verification = await this.getVerification(code);
    if (!verification) {
      throw new Error("Invalid verification code.");
    }
    if (!verification.verified) {
      throw new Error("This code has not been verified yet.");
    }
    const metadata = verification.metadata;
    await this.deleteVerification(verification.id);
    return { ...metadata, phoneNumber: verification.phoneNumber, clientSecretId: verification.clientSecretId };
  }

  private extractVerificationCode(message: string): string | null {
    const match = message.match(/verification code:\s*([a-zA-Z0-9]{6})/i);
    return match && match[1] ? match[1] : null;
  }
}

export function createWhatsappOAuth(config: WhatsappOAuthConfig): WhatsappOAuthSdk {
  return new WhatsappOAuthSdk(config);
}
