import { z } from 'zod';
import * as schemas from '../schemas';

export interface TelegramSDKOptions {
  apiId: string;
  apiHash: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  result: T;
}

export interface ErrorResponse {
  ok: false;
  error_code: number;
  description: string;
}

export type AcceptAuthorizationParams = z.infer<typeof schemas.acceptAuthorizationSchema>;
export type ChangeAuthorizationSettingsParams = z.infer<typeof schemas.changeAuthorizationSettingsSchema>;
export type ChangePhoneParams = z.infer<typeof schemas.changePhoneSchema>;
export type CheckUsernameParams = z.infer<typeof schemas.checkUsernameSchema>;
export type SendMessageParams = z.infer<typeof schemas.sendMessageSchema>;
export type GetUsersParams = z.infer<typeof schemas.getUsersSchema>;

// Add other type exports here as needed...
