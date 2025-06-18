import { z } from 'zod';

export const getAboutWhereSchema = z.object({
  after: z.string().describe('fullname of a thing').optional(),
  before: z.string().describe('fullname of a thing').optional(),
  count: z.number().int().positive().default(0).describe('a positive integer (default: 0)').optional(),
  limit: z.number().int().min(1).max(100).default(25).describe('the maximum number of items desired (default: 25, maximum: 100)').optional(),
  show: z.literal('all').describe('(optional) the string all').optional(),
  sr_detail: z.boolean().describe('(optional) expand subreddits').optional(),
  user: z.string().describe('A valid, existing reddit username').optional(),
});

export const deleteSrImgSchema = z.object({
  img_name: z.string().describe('a valid subreddit image name'),
});

export const recommendSrNamesSchema = z.object({
  omit: z.string().describe('comma-delimited list of subreddit names').optional(),
  over_18: z.boolean().optional(),
  srnames: z.string().describe('comma-delimited list of subreddit names'),
});

export const searchRedditNamesSchema = z.object({
  exact: z.boolean().optional(),
  include_over_18: z.boolean().optional(),
  include_unadvertisable: z.boolean().optional(),
  query: z.string().max(50).describe('a string up to 50 characters long, consisting of printable characters.'),
  search_query_id: z.string().uuid().optional(),
  typeahead_active: z.boolean().nullable().optional(),
});

export const searchSubredditsSchema = z.object({
  exact: z.boolean().optional(),
  include_over_18: z.boolean().optional(),
  include_unadvertisable: z.boolean().optional(),
  query: z.string().max(50).describe('a string up to 50 characters long, consisting of printable characters.'),
  search_query_id: z.string().uuid().optional(),
  typeahead_active: z.boolean().nullable().optional(),
});

export const siteAdminSchema = z.object({
  accept_followers: z.boolean().optional(),
  admin_override_spam_comments: z.boolean().optional(),
  admin_override_spam_links: z.boolean().optional(),
  admin_override_spam_selfposts: z.boolean().optional(),
  all_original_content: z.boolean().optional(),
  allow_chat_post_creation: z.boolean().optional(),
  allow_discovery: z.boolean().optional(),
  allow_galleries: z.boolean().optional(),
  allow_images: z.boolean().optional(),
  allow_polls: z.boolean().optional(),
  allow_post_crossposts: z.boolean().optional(),
  allow_prediction_contributors: z.boolean().optional(),
  allow_predictions: z.boolean().optional(),
  allow_predictions_tournament: z.boolean().optional(),
  allow_talks: z.boolean().optional(),
  allow_top: z.boolean().optional(),
  allow_videos: z.boolean().optional(),
  api_type: z.literal('json'),
  collapse_deleted_comments: z.boolean().optional(),
  comment_contribution_settings: z.object({
    allowed_media_types: z.array(z.enum(['unknown', 'giphy', 'static', 'video', 'animated', 'expression'])),
  }).optional(),
  comment_score_hide_mins: z.number().int().min(0).max(1440).default(0).optional(),
  crowd_control_chat_level: z.number().int().min(0).max(3).optional(),
  crowd_control_filter: z.boolean().optional(),
  crowd_control_level: z.number().int().min(0).max(3).optional(),
  crowd_control_mode: z.boolean().optional(),
  crowd_control_post_level: z.number().int().min(0).max(3).optional(),
  description: z.string().describe('raw markdown text').optional(),
  disable_contributor_requests: z.boolean().optional(),
  exclude_banned_modqueue: z.boolean().optional(),
  free_form_reports: z.boolean().optional(),
  'g-recaptcha-response': z.string().optional(),
  hateful_content_threshold_abuse: z.number().int().min(0).max(3).optional(),
  hateful_content_threshold_identity: z.number().int().min(0).max(3).optional(),
  'header-title': z.string().max(500).optional(),
  hide_ads: z.boolean().optional(),
  key_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).describe('a 6-digit rgb hex color, e.g. #AABBCC').optional(),
  link_type: z.enum(['any', 'link', 'self']).optional(),
  modmail_harassment_filter_enabled: z.boolean().optional(),
  name: z.string().describe('subreddit name').optional(),
  new_pinned_post_pns_enabled: z.boolean().optional(),
  original_content_tag_enabled: z.boolean().optional(),
  over_18: z.boolean().optional(),
  prediction_leaderboard_entry_type: z.number().int().min(0).max(2).optional(),
  public_description: z.string().describe('raw markdown text').optional(),
  restrict_commenting: z.boolean().optional(),
  restrict_posting: z.boolean().optional(),
  should_archive_posts: z.boolean().optional(),
  show_media: z.boolean().optional(),
  show_media_preview: z.boolean().optional(),
  spam_comments: z.enum(['low', 'high', 'all']).optional(),
  spam_links: z.enum(['low', 'high', 'all']).optional(),
  spam_selfposts: z.enum(['low', 'high', 'all']).optional(),
  spoilers_enabled: z.boolean().optional(),
  sr: z.string().describe('fullname of a thing').optional(),
  submit_link_label: z.string().max(60).optional(),
  submit_text: z.string().describe('raw markdown text').optional(),
  submit_text_label: z.string().max(60).optional(),
  subreddit_discovery_settings: z.object({
    disabled_discovery_types: z.array(z.enum(['unknown', 'onboarding'])),
  }).optional(),
  suggested_comment_sort: z.enum(['confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live']).optional(),
  title: z.string().max(100).optional(),
  type: z.enum(['gold_restricted', 'archived', 'restricted', 'private', 'employees_only', 'gold_only', 'public', 'user']).optional(),
  user_flair_pns_enabled: z.boolean().optional(),
  welcome_message_enabled: z.boolean().optional(),
  welcome_message_text: z.string().describe('raw markdown text').optional(),
  wiki_edit_age: z.number().int().min(0).max(36600).default(0).optional(),
  wiki_edit_karma: z.number().int().min(0).max(1000000000).default(0).optional(),
  wikimode: z.enum(['disabled', 'modonly', 'anyone']).optional(),
});

export const subredditAutocompleteSchema = z.object({
  include_over_18: z.boolean().optional(),
  include_profiles: z.boolean().optional(),
  query: z.string().max(25).describe('a string up to 25 characters long, consisting of printable characters.'),
});

export const subredditAutocompleteV2Schema = z.object({
  include_over_18: z.boolean().optional(),
  include_profiles: z.boolean().optional(),
  limit: z.number().int().min(1).max(10).default(5).optional(),
  query: z.string().max(25).describe('a string up to 25 characters long, consisting of printable characters.'),
  search_query_id: z.string().uuid().optional(),
  typeahead_active: z.boolean().nullable().optional(),
});

export const subredditStylesheetSchema = z.object({
  op: z.enum(['save', 'preview']),
  reason: z.string().max(256).describe('a string up to 256 characters long, consisting of printable characters.'),
  stylesheet_contents: z.string().describe('the new stylesheet content'),
});

export const subscribeSchema = z.object({
  action: z.enum(['sub', 'unsub']),
  action_source: z.enum(['onboarding', 'autosubscribe']).optional(),
  skip_initial_defaults: z.boolean().optional(),
  sr: z.string().describe('A comma-separated list of subreddit fullnames').optional(),
  sr_name: z.string().describe('A comma-separated list of subreddit names').optional(),
}).refine(data => data.sr || data.sr_name, {
  message: 'Either sr or sr_name must be provided',
});

export const uploadSrImgSchema = z.object({
  file: z.instanceof(File).describe('file upload with maximum size of 500 KiB'),
  formid: z.string().optional(),
  header: z.number().int().min(0).max(1).optional(),
  img_type: z.enum(['png', 'jpg']).default('png').optional(),
  name: z.string().describe('a valid subreddit image name').optional(),
  upload_type: z.enum(['img', 'header', 'icon', 'banner']),
}); 