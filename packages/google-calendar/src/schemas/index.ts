import { z } from 'zod';
import {
  AclRuleSchema,
  CalendarListEntrySchema,
  CalendarSchema,
  ChannelSchema,
  ColorsSchema,
  EventSchema,
  FreeBusyRequestSchema,
  FreeBusyResponseSchema,
  SettingSchema,
} from '../types';

export {
  AclRuleSchema,
  CalendarListEntrySchema,
  CalendarSchema,
  ChannelSchema,
  ColorsSchema,
  EventSchema,
  FreeBusyRequestSchema,
  FreeBusyResponseSchema,
  SettingSchema,
};

export const GoogleCalendarSDKConfigSchema = z.object({
  clientId: z.string().describe('Google OAuth 2.0 client ID'),
  clientSecret: z.string().describe('Google OAuth 2.0 client secret'),
  redirectUri: z.string().url().describe('Authorized redirect URI'),
  accessToken: z.string().optional().describe('OAuth 2.0 access token'),
  refreshToken: z.string().optional().describe('OAuth 2.0 refresh token'),
}).describe('Google Calendar SDK configuration');

export type GoogleCalendarSDKConfig = z.infer<typeof GoogleCalendarSDKConfigSchema>;
