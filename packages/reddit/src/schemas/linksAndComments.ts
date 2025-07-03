import { z } from 'zod';

export const submitCommentSchema = z.object({
  api_type: z.literal('json'),
  recaptcha_token: z.string().optional(),
  return_rtjson: z.boolean().optional(),
  richtext_json: z.string().optional().describe('JSON data'),
  text: z.string().describe('raw markdown text'),
  thing_id: z.string().describe('fullname of parent thing'),
  video_poster_url: z.string().optional(),
});

export const deleteSchema = z.object({
  id: z.string().describe('fullname of a thing created by the user'),
});

export const editUserTextSchema = z.object({
  api_type: z.literal('json'),
  return_rtjson: z.boolean().optional(),
  richtext_json: z.string().optional().describe('JSON data'),
  text: z.string().describe('raw markdown text'),
  thing_id: z.string().describe('fullname of a thing'),
  video_poster_url: z.string().optional(),
});

export const followPostSchema = z.object({
  follow: z.boolean().describe('True to follow or False to unfollow'),
  fullname: z.string().describe('fullname of a link'),
});

export const hideSchema = z.object({
  id: z.string().describe('A comma-separated list of link fullnames'),
});

export const infoParamsSchema = z.object({
  id: z.string().optional().describe('A comma-separated list of thing fullnames'),
  sr_name: z.string().optional().describe('comma-delimited list of subreddit names'),
  url: z.string().url().optional().describe('a valid URL'),
});

export const lockSchema = z.object({
  id: z.string().describe('fullname of a thing'),
});

export const markNsfwSchema = z.object({
  id: z.string().describe('fullname of a thing'),
});

export const moreChildrenSchema = z.object({
  api_type: z.literal('json').optional(),
  children: z.string(),
  depth: z.number().int().optional(),
  id: z.string().optional().describe('id of the associated MoreChildren object'),
  limit_children: z.boolean().optional(),
  link_id: z.string().describe('fullname of a link'),
  sort: z.enum(['confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live']).optional(),
});

export const reportSchema = z.object({
  additional_info: z.string().max(2000).optional(),
  api_type: z.literal('json').optional(),
  custom_text: z.string().max(2000).optional(),
  from_help_desk: z.boolean().optional(),
  from_modmail: z.boolean().optional(),
  modmail_conv_id: z.string().optional().describe('base36 modmail conversation id'),
  other_reason: z.string().max(100).optional(),
  reason: z.string().max(100).optional(),
  rule_reason: z.string().max(100).optional(),
  site_reason: z.string().max(100).optional(),
  sr_name: z.string().max(1000).optional(),
  thing_id: z.string().describe('fullname of a thing'),
  usernames: z.string().optional().describe('A comma-separated list of items'),
});

export const saveSchema = z.object({
  category: z.string().optional().describe('a category name'),
  id: z.string().describe('fullname of a thing'),
});

export const sendRepliesSchema = z.object({
  id: z.string().describe('fullname of a thing created by the user'),
  state: z.boolean(),
});

export const setContestModeSchema = z.object({
  api_type: z.literal('json').optional(),
  id: z.string(),
  state: z.boolean(),
});

export const setSubredditStickySchema = z.object({
  api_type: z.literal('json').optional(),
  id: z.string(),
  num: z.number().int().min(1).max(4).optional(),
  state: z.boolean(),
  to_profile: z.boolean().optional(),
});

export const setSuggestedSortSchema = z.object({
  api_type: z.literal('json').optional(),
  id: z.string(),
  sort: z.enum(['confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live', 'blank']),
});

export const spoilerSchema = z.object({
  id: z.string().describe('fullname of a link'),
});

export const storeVisitsSchema = z.object({
  links: z.string().describe('A comma-separated list of link fullnames'),
});

export const submitLinkSchema = z.object({
    ad: z.boolean().optional(),
    api_type: z.literal('json').optional(),
    app: z.string().optional(),
    collection_id: z.string().uuid().optional(),
    extension: z.string().optional(),
    flair_id: z.string().max(36).optional(),
    flair_text: z.string().max(64).optional(),
    'g-recaptcha-response': z.string().optional(),
    kind: z.enum(['link', 'self', 'image', 'video', 'videogif']),
    nsfw: z.boolean().optional(),
    post_set_default_post_id: z.string().optional(),
    post_set_id: z.string().optional(),
    recaptcha_token: z.string().optional(),
    resubmit: z.boolean().optional(),
    richtext_json: z.string().optional(),
    sendreplies: z.boolean().optional(),
    spoiler: z.boolean().optional(),
    sr: z.string().describe('subreddit name'),
    text: z.string().optional(),
    title: z.string().max(300),
    url: z.string().url().optional(),
    video_poster_url: z.string().url().optional(),
});

export const unhideSchema = z.object({
  id: z.string().describe('A comma-separated list of link fullnames'),
});

export const unlockSchema = z.object({
  id: z.string().describe('fullname of a thing'),
});

export const unmarkNsfwSchema = z.object({
  id: z.string().describe('fullname of a thing'),
});

export const unsaveSchema = z.object({
  id: z.string().describe('fullname of a thing'),
});

export const unspoilerschema = z.object({
  id: z.string().describe('fullname of a link'),
});

export const voteSchema = z.object({
  dir: z.enum(['1', '0', '-1']),
  id: z.string().describe('fullname of a thing'),
  rank: z.number().int().gt(1).optional(),
}); 