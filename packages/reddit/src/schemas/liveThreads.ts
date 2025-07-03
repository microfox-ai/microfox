import { z } from 'zod';
import { listingParamsSchema } from './index';

export const getLiveByIdsSchema = z.object({
  names: z.string().describe('A comma-delimited list of live thread fullnames or IDs'),
});

export const createLiveThreadSchema = z.object({
  api_type: z.literal('json').optional(),
  description: z.string().describe('Raw markdown text for the description'),
  nsfw: z.boolean().optional(),
  resources: z.string().optional().describe('Raw markdown text for the resources section'),
  title: z.string().max(120).describe('The title of the live thread'),
});

export const getHappeningNowSchema = z.object({
  show_announcements: z.boolean().optional(),
});

export const deleteLiveUpdateSchema = z.object({
  api_type: z.literal('json').optional(),
  id: z.string().describe('The ID of a single update, e.g., LiveUpdate_ff87068e-a126-11e3-9f93-12313b0b3603'),
});

export const editLiveThreadSchema = z.object({
  api_type: z.literal('json').optional(),
  description: z.string().optional(),
  nsfw: z.boolean().optional(),
  resources: z.string().optional(),
  title: z.string().max(120).optional(),
});

export const manageDiscussionSchema = z.object({
  api_type: z.literal('json').optional(),
  link: z.string().describe('The base 36 ID of a Link'),
});

export const manageContributorSchema = z.object({
  api_type: z.literal('json').optional(),
  name: z.string().describe('The name of an existing user'),
  permissions: z.string().describe('Permission description e.g., +update,+edit,-manage'),
  type: z.enum(['liveupdate_contributor_invite', 'liveupdate_contributor']),
});

export const reportLiveThreadSchema = z.object({
  api_type: z.literal('json').optional(),
  type: z.enum(['spam', 'vote-manipulation', 'personal-information', 'sexualizing-minors', 'site-breaking']),
});

export const removeContributorSchema = z.object({
  api_type: z.literal('json').optional(),
  id: z.string().describe('Fullname of an account'),
});

export const postUpdateSchema = z.object({
  api_type: z.literal('json').optional(),
  body: z.string().describe('Raw markdown text for the update'),
});

export const getLiveUpdatesListingSchema = listingParamsSchema.extend({
  is_embed: z.boolean().optional(),
  stylesr: z.string().optional().describe('Subreddit name'),
});

export const getDiscussionsListingSchema = listingParamsSchema; 