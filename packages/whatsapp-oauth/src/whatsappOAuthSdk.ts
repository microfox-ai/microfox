import {
  ClientSecret,
  CreateVerificationPayload,
  WhatsAppVerification,
  clientSecretSchema,
  createVerificationPayloadSchema,
  whatsappOAuthConfigSchema,
  whatsappVerificationSchema,
  WhatsappOAuthConfig,
} from './types';
import { z } from 'zod';
import { customAlphabet } from 'nanoid';

const generateCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export class WhatsappOAuthSdk {
  private apiBaseUrl: string;
  private whatsappBusinessPhoneNumber?: string;
  private whatsappBusinessPhoneNumberId?: string;
  private whatsappBusinessAccountId?: string;

  constructor(config: WhatsappOAuthConfig) {
    const validatedConfig = whatsappOAuthConfigSchema.parse(config);
    this.apiBaseUrl = validatedConfig.apiBaseUrl ?? process.env.WHATSAPP_API_BASE_URL ?? '';
    this.whatsappBusinessPhoneNumber =
      validatedConfig.whatsappBusinessPhoneNumber ??
      process.env.WHATSAPP_BUSINESS_PHONE_NUMBER;
    this.whatsappBusinessPhoneNumberId =
      validatedConfig.whatsappBusinessPhoneNumberId ??
      process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID;
    this.whatsappBusinessAccountId =
      validatedConfig.whatsappBusinessAccountId ??
      process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
  }

  public getAuthUrl(
    clientSecretId: string,
    businessUserId: string,
    callbackUri: string,
    slug: string,
  ): string {
    const params = new URLSearchParams({
      clientSecretId,
      businessUserId,
      callbackUri,
    });
    return `${this.apiBaseUrl}/widget/${slug}/whatsapp?${params.toString()}`;
  }

  public async createVerification(
    payload: CreateVerificationPayload,
  ): Promise<WhatsAppVerification> {
    const validatedPayload = createVerificationPayloadSchema.parse({
      ...payload,
      code: generateCode(),
    });

    const response = await fetch(`${this.apiBaseUrl}/api/whatsapp-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return whatsappVerificationSchema.parse(data);
  }

  public async getVerification(
    clientSecretId: string,
    userId: string,
  ): Promise<WhatsAppVerification[] | null> {
    const response = await fetch(
      `${this.apiBaseUrl}/api/whatsapp-verify?clientSecretId=${clientSecretId}&userId=${userId}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return z.array(whatsappVerificationSchema).parse(data);
  }

  public async deleteVerification(id: string): Promise<any> {
    const response = await fetch(
      `${this.apiBaseUrl}/api/whatsapp-verify?id=${id}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  public async getClientSecret(clientSecretId: string): Promise<ClientSecret> {
    const response = await fetch(
      `${this.apiBaseUrl}/api/whatsapp-verify/identity?id=${clientSecretId}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return clientSecretSchema.parse(data);
  }
}

export function createWhatsappOAuth(config: WhatsappOAuthConfig): WhatsappOAuthSdk {
  return new WhatsappOAuthSdk(config);
}
