import { z } from 'zod';
import { TelegramSDKOptions, ApiResponse, ErrorResponse } from './types';
import * as schemas from './schemas';

export class TelegramSDK {
  private apiId: string;
  private apiHash: string;
  private baseUrl: string = 'https://api.telegram.org';

  constructor(options: TelegramSDKOptions) {
    this.apiId = options.apiId;
    this.apiHash = options.apiHash;
  }

  private async request<T>(method: string, params: Record<string, any>): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/bot${this.apiId}:${this.apiHash}/${method}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Telegram API Error: ${(data as ErrorResponse).description}`);
    }

    return data as ApiResponse<T>;
  }

  account = {
    acceptAuthorization: async (params: z.infer<typeof schemas.acceptAuthorizationSchema>) => {
      return this.request<boolean>('account.acceptAuthorization', params);
    },

    changeAuthorizationSettings: async (params: z.infer<typeof schemas.changeAuthorizationSettingsSchema>) => {
      return this.request<boolean>('account.changeAuthorizationSettings', params);
    },

    changePhone: async (params: z.infer<typeof schemas.changePhoneSchema>) => {
      return this.request<any>('account.changePhone', params);
    },

    checkUsername: async (params: z.infer<typeof schemas.checkUsernameSchema>) => {
      return this.request<boolean>('account.checkUsername', params);
    },

    // Add other account methods here...
  };

  messages = {
    sendMessage: async (params: z.infer<typeof schemas.sendMessageSchema>) => {
      return this.request<any>('messages.sendMessage', params);
    },

    // Add other message methods here...
  };

  users = {
    getUsers: async (params: z.infer<typeof schemas.getUsersSchema>) => {
      return this.request<any[]>('users.getUsers', params);
    },

    // Add other user methods here...
  };

  // Add other namespaces and methods for remaining endpoints...
}

export function createTelegramSDK(options: TelegramSDKOptions): TelegramSDK {
  return new TelegramSDK(options);
}
