import { z } from 'zod';

export const acceptAuthorizationSchema = z.object({
  form_id: z.number().describe('Authorization form ID'),
  flags: z.number().describe('Flags'),
  public_key: z.string().describe('Public key'),
  nonce: z.string().describe('Nonce'),
  encrypted_data: z.string().describe('Encrypted data'),
});

export const changeAuthorizationSettingsSchema = z.object({
  hash: z.number().describe('Hash'),
  flags: z.number().describe('Flags'),
  app_version: z.string().optional().describe('Application version'),
  device_model: z.string().optional().describe('Device model'),
  system_version: z.string().optional().describe('System version'),
  system_language_code: z.string().optional().describe('System language code'),
  lang_pack: z.string().optional().describe('Language pack'),
  lang_code: z.string().optional().describe('Language code'),
  enable_animated_emojis: z.boolean().optional().describe('Enable animated emojis'),
  enable_animated_stickers: z.boolean().optional().describe('Enable animated stickers'),
});

export const changePhoneSchema = z.object({
  phone_number: z.string().describe('New phone number'),
  phone_code_hash: z.string().describe('Phone code hash'),
  phone_code: z.string().describe('Phone code'),
});

export const checkUsernameSchema = z.object({
  username: z.string().describe('Username to check'),
});

export const sendMessageSchema = z.object({
  chat_id: z.number().describe('Chat ID'),
  text: z.string().describe('Message text'),
  // Add other optional parameters as needed
});

export const getUsersSchema = z.object({
  id: z.array(z.number()).describe('Array of user IDs'),
});

// Add other schemas here as needed...
