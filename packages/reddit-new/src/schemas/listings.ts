import { z } from 'zod';
import { listingParamsSchema } from './index';

export const getBestSchema = listingParamsSchema.extend({
    g: z.enum([
        'GLOBAL', 'US', 'AR', 'AU', 'BG', 'CA', 'CL', 'CO', 'HR', 'CZ', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IN', 'IE', 'IT', 'JP', 'MY', 'MX', 'NZ', 'PH', 'PL', 'PT', 'PR', 'RO', 'RS', 'SG', 'ES', 'SE', 'TW', 'TH', 'TR', 'GB', 
        'US_WA', 'US_DE', 'US_DC', 'US_WI', 'US_WV', 'US_HI', 'US_FL', 'US_WY', 'US_NH', 'US_NJ', 'US_NM', 'US_TX', 'US_LA', 'US_NC', 'US_ND', 'US_NE', 'US_TN', 'US_NY', 'US_PA', 'US_CA', 'US_NV', 'US_VA', 'US_CO', 'US_AK', 'US_AL', 'US_AR', 'US_VT', 'US_IL', 'US_GA', 'US_IN', 'US_IA', 'US_OK', 'US_AZ', 'US_ID', 'US_CT', 'US_ME', 'US_MD', 'US_MA', 'US_OH', 'US_UT', 'US_MO', 'US_MN', 'US_MI', 'US_RI', 'US_KS', 'US_MT', 'US_MS', 'US_SC', 'US_KY', 'US_OR', 'US_SD'
    ]).optional()
});

export const getByIdSchema = z.object({
  names: z.string().describe('A comma-separated list of link fullnames'),
});

export const getCommentsSchema = z.object({
  article: z.string().describe('ID36 of a link'),
  comment: z.string().optional().describe('ID36 of a comment'),
  context: z.number().int().min(0).max(8).optional(),
  depth: z.number().int().optional(),
  limit: z.number().int().optional(),
  showedits: z.boolean().optional(),
  showmedia: z.boolean().optional(),
  showmore: z.boolean().optional(),
  showtitle: z.boolean().optional(),
  sort: z.enum(['confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live']).optional(),
  sr_detail: z.boolean().optional(),
  theme: z.enum(['default', 'dark']).optional(),
  threaded: z.boolean().optional(),
  truncate: z.number().int().min(0).max(50).optional(),
});

export const getDuplicatesSchema = listingParamsSchema.extend({
  article: z.string().describe('The base 36 ID of a Link'),
  crossposts_only: z.boolean().optional(),
  sort: z.enum(['num_comments', 'new']).optional(),
  sr: z.string().optional().describe('subreddit name'),
});

export const getHotSchema = listingParamsSchema.extend({
    g: z.enum([
        'GLOBAL', 'US', 'AR', 'AU', 'BG', 'CA', 'CL', 'CO', 'HR', 'CZ', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IN', 'IE', 'IT', 'JP', 'MY', 'MX', 'NZ', 'PH', 'PL', 'PT', 'PR', 'RO', 'RS', 'SG', 'ES', 'SE', 'TW', 'TH', 'TR', 'GB', 
        'US_WA', 'US_DE', 'US_DC', 'US_WI', 'US_WV', 'US_HI', 'US_FL', 'US_WY', 'US_NH', 'US_NJ', 'US_NM', 'US_TX', 'US_LA', 'US_NC', 'US_ND', 'US_NE', 'US_TN', 'US_NY', 'US_PA', 'US_CA', 'US_NV', 'US_VA', 'US_CO', 'US_AK', 'US_AL', 'US_AR', 'US_VT', 'US_IL', 'US_GA', 'US_IN', 'US_IA', 'US_OK', 'US_AZ', 'US_ID', 'US_CT', 'US_ME', 'US_MD', 'US_MA', 'US_OH', 'US_UT', 'US_MO', 'US_MN', 'US_MI', 'US_RI', 'US_KS', 'US_MT', 'US_MS', 'US_SC', 'US_KY', 'US_OR', 'US_SD'
    ]).optional()
});

export const getNewSchema = listingParamsSchema;
export const getRisingSchema = listingParamsSchema;

export const getSortedSchema = listingParamsSchema.extend({
  t: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional(),
});

export const searchSchema = z.object({
  after: z.string().optional(),
  before: z.string().optional(),
  category: z.string().max(5).optional(),
  count: z.number().int().nonnegative().optional(),
  include_facets: z.boolean().optional(),
  limit: z.number().int().optional(),
  q: z.string().max(512),
  restrict_sr: z.boolean().optional(),
  show: z.literal('all').optional(),
  sort: z.enum(['relevance', 'hot', 'top', 'new', 'comments']).optional(),
  sr_detail: z.boolean().optional(),
  t: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional(),
  type: z.string().optional(), // comma-delimited list of result types (sr, link, user)
}); 