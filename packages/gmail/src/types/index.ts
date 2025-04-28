import { z } from 'zod';
import {
  GmailSdkConfigSchema,
  MessageSchema,
  ThreadSchema,
  LabelSchema,
  MessageHeadersSchema,
  MessagePayloadSchema,
  MessageInputSchema,
  LabelInputSchema,
} from '../schemas/index';

export type GmailSdkConfig = z.infer<typeof GmailSdkConfigSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
export type Label = z.infer<typeof LabelSchema>;
export type MessageHeaders = z.infer<typeof MessageHeadersSchema>;
export type MessagePayload = z.infer<typeof MessagePayloadSchema>;
export type MessageInput = z.infer<typeof MessageInputSchema>;
export type LabelInput = z.infer<typeof LabelInputSchema>;
