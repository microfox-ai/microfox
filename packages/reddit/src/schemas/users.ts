import { z } from 'zod';
import { listingParamsSchema } from './index';

export const searchUsersSchema = listingParamsSchema.extend({
  q: z.string(),
  search_query_id: z.string().uuid().optional(),
  sort: z.enum(['relevance', 'activity']).optional(),
  typeahead_active: z.boolean().optional(),
});

export const userProfileWhereSchema = listingParamsSchema.extend({
  show: z.enum(['given']).optional(),
  sort: z.enum(['hot', 'new', 'top', 'controversial']).optional(),
  t: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional(),
  type: z.enum(['comments', 'links']).optional(),
  username: z.string(),
  where: z.enum(['overview', 'submitted', 'comments', 'upvoted', 'downvoted', 'hidden', 'saved', 'gilded']),
});

export const blockUserSchema = z.object({
  account_id: z.string(),
  api_type: z.literal('json'),
  name: z.string(),
});

export const friendSchema = z.object({
  api_type: z.literal('json'),
  ban_context: z.string().optional(),
  ban_message: z.string().optional(),
  ban_reason: z.string().max(100).optional(),
  container: z.string().optional(),
  duration: z.number().int().min(1).max(999).optional(),
  name: z.string(),
  note: z.string().max(300).optional(),
  permissions: z.string().optional(),
  type: z.enum(['friend', 'moderator', 'moderator_invite', 'contributor', 'banned', 'muted', 'wikibanned', 'wikicontributor']),
});

export const reportUserSchema = z.object({
  details: z.string().optional(),
  reason: z.string().max(100),
  user: z.string(),
});

export const setPermissionsSchema = z.object({
  api_type: z.literal('json'),
  name: z.string(),
  permissions: z.string(),
  type: z.string(),
});

export const unfriendSchema = z.object({
  api_type: z.literal('json'),
  name: z.string(),
  type: z.literal('friend'),
});

export const userDataByAccountIdsSchema = z.object({
  ids: z.string(), // Comma-separated list of account fullnames
});

export const usernameAvailableSchema = z.object({
  user: z.string(),
}); 