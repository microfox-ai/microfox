import { z } from 'zod';

export const getScopesSchema = z.object({
  scopes: z.string().optional().describe('An OAuth2 scope string'),
}); 