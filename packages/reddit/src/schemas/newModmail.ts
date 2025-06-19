import { z } from 'zod';

export const bulkReadSchema = z.object({
  entity: z.string().describe('Comma-delimited list of subreddit names'),
  state: z.enum([
    'all', 'appeals', 'notifications', 'inbox', 'filtered', 
    'inprogress', 'mod', 'archived', 'default', 'highlighted', 
    'join_requests', 'new'
  ]),
});

export const getConversationsSchema = z.object({
  after: z.string().optional().describe('A Modmail Conversation ID'),
  entity: z.string().describe('Comma-delimited list of subreddit names'),
  limit: z.number().int().min(1).max(100).optional(),
  sort: z.enum(['recent', 'mod', 'user', 'unread']).optional(),
  state: z.enum([
    'all', 'appeals', 'notifications', 'inbox', 'filtered', 
    'inprogress', 'mod', 'archived', 'default', 'highlighted', 
    'join_requests', 'new'
  ]).optional(),
});

export const createConversationSchema = z.object({
  body: z.string(),
  isAuthorHidden: z.boolean().optional(),
  srName: z.string(),
  subject: z.string().max(100),
  to: z.string().nullable(),
});

export const getConversationSchema = z.object({
  markRead: z.boolean().optional(),
});

export const createMessageSchema = z.object({
  body: z.string(),
  isAuthorHidden: z.boolean().optional(),
  isInternal: z.boolean().optional(),
});

export const muteConversationSchema = z.object({
  num_hours: z.enum(['72', '168', '672']),
});

export const tempBanSchema = z.object({
  duration: z.number().int().min(1).max(999),
});

export const conversationIdsSchema = z.object({
    conversationIds: z.string().describe('A comma-separated list of items'),
}); 