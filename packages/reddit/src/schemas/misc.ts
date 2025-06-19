import { z } from 'zod';

export const getScopesSchema = z.object({
  scopes: z.string().optional().describe('An OAuth2 scope string'),
}); 

export const needsCaptchaSchema = z.object({
  captcha: z.string().optional().describe('The captcha code'),
});