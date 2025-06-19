import { z } from 'zod';
import { listingParamsSchema } from './index';

export const blockPrivateMessageSchema = z.object({
  id: z.string().describe('Fullname of a thing.'),
});

export const messageIdListSchema = z.object({
  id: z.string().describe('A comma-separated list of thing fullnames.'),
});

export const composeMessageSchema = z.object({
  api_type: z.literal('json').optional(),
  from_sr: z.string().optional().describe('Subreddit name to message from.'),
  'g-recaptcha-response': z.string().optional(),
  subject: z.string().max(100),
  text: z.string(),
  to: z.string().describe('The name of an existing user.'),
});

export const readAllMessagesSchema = z.object({
  filter_types: z.string().optional().describe('A comma-separated list of items to filter by.'),
});

export const unblockSubredditSchema = z.object({
  id: z.string().describe('Fullname of a thing.'),
});

export const getMessageListingSchema = listingParamsSchema.extend({
  mark: z.enum(['true', 'false']).optional(),
  max_replies: z.number().int().min(0).max(300).optional(),
  mid: z.string().optional(),
}); 