import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string(),
  limit: z.number().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
  count: z.number().optional(),
  show: z.enum(['all']).optional(),
  sr_detail: z.boolean().optional(),
  restrict_sr: z.boolean().optional(),
  sort: z.enum(['relevance', 'hot', 'top', 'new', 'comments']).optional(),
  t: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional(),
  type: z.array(z.enum(['sr', 'link', 'user'])).optional().transform(val => val?.join(','))
}); 