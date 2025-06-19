import { z } from 'zod';
import { userSchema } from './index';

export const getPrefsFieldsSchema = z.array(z.enum([
  "beta", "threaded_messages", "hide_downs", "private_feeds",
  "activity_relevant_ads", "enable_reddit_pro_analytics_emails",
  "profile_opt_out", "bad_comment_autocollapse",
  "third_party_site_data_personalized_content", "show_link_flair",
  "live_bar_recommendations_enabled", "show_trending",
  "top_karma_subreddits", "country_code", "theme_selector",
  "monitor_mentions", "email_comment_reply", "newwindow",
  "email_new_user_welcome", "research", "ignore_suggested_sort",
  "show_presence", "email_upvote_comment", "email_digests",
  "whatsapp_comment_reply", "num_comments",
  "feed_recommendations_enabled", "clickgadget", "use_global_defaults",
  "label_nsfw", "domain_details", "show_stylesheets", "live_orangereds",
  "highlight_controversial", "mark_messages_read", "no_profanity",
  "email_unsubscribe_all", "whatsapp_enabled", "lang", "in_redesign_beta",
  "email_messages", "third_party_data_personalized_ads",
  "email_chat_request", "allow_clicktracking", "hide_from_robots",
  "show_gold_expiration", "show_twitter", "compress", "store_visits",
  "video_autoplay", "email_upvote_post", "email_username_mention",
  "media_preview", "email_user_new_follower", "nightmode",
  "enable_default_themes", "geopopular",
  "third_party_site_data_personalized_ads", "survey_last_seen_time",
  "threaded_modmail", "enable_followers", "hide_ups", "min_comment_score",
  "public_votes", "show_location_based_recommendations",
  "email_post_reply", "collapse_read_messages", "show_flair",
  "send_crosspost_messages", "search_include_over_18", "hide_ads",
  "third_party_personalized_ads", "min_link_score", "over_18",
  "sms_notifications_enabled", "numsites", "media", "legacy_search",
  "email_private_message", "send_welcome_messages",
  "email_community_discovery", "highlight_new_comments",
  "default_comment_sort", "accept_pms"
])).describe('A comma-separated list of preference fields to return.');

export const karmaBreakdownSchema = z.object({
  sr: z.string().describe('The name of the subreddit.'),
  comment_karma: z.number().describe('The karma earned from comments in this subreddit.'),
  post_karma: z.number().describe('The karma earned from posts in this subreddit.'),
}).describe('Karma breakdown by subreddit.');

export const trophySchema = z.object({
  id: z.string().nullable().describe('The ID of the trophy.'),
  name: z.string().describe('The name of the trophy.'),
  description: z.string().nullable().describe('The description of the trophy.'),
  icon_70: z.string().describe('The URL of the 70x70 trophy icon.'),
  icon_40: z.string().describe('The URL of the 40x40 trophy icon.'),
  award_id: z.string().nullable().describe('The ID of the award associated with the trophy.'),
  url: z.string().nullable().describe('A URL associated with the trophy.'),
}).describe('A user trophy.');

export const trophyListSchema = z.object({
  kind: z.literal('TrophyList'),
  data: z.object({
    trophies: z.array(z.object({
      kind: z.literal('t6'),
      data: trophySchema,
    })).describe('A list of trophies.'),
  }),
}).describe('A list of user trophies.');

export const updatePrefsSchema = z.object({
    accept_pms: z.enum(['everyone', 'whitelisted']).optional(),
    activity_relevant_ads: z.boolean().optional(),
    allow_clicktracking: z.boolean().optional(),
    bad_comment_autocollapse: z.enum(['off', 'low', 'medium', 'high']).optional(),
    beta: z.boolean().optional(),
    clickgadget: z.boolean().optional(),
    collapse_read_messages: z.boolean().optional(),
    compress: z.boolean().optional(),
    country_code: z.enum(['WF', 'JP', 'JM', 'JO', 'WS', 'JE', 'GW', 'GU', 'GT', 'GS', 'GR', 'GQ', 'GP', 'GY', 'GG', 'GF', 'GE', 'GD', 'GB', 'GA', 'GN', 'GM', 'GL', 'GI', 'GH', 'PR', 'PS', 'PW', 'PT', 'PY', 'PA', 'PF', 'PG', 'PE', 'PK', 'PH', 'PN', 'PL', 'PM', 'ZM', 'ZA', 'ZZ', 'ZW', 'ME', 'MD', 'MG', 'MF', 'MA', 'MC', 'MM', 'ML', 'MO', 'MN', 'MH', 'MK', 'MU', 'MT', 'MW', 'MV', 'MQ', 'MP', 'MS', 'MR', 'MY', 'MX', 'MZ', 'FR', 'FI', 'FJ', 'FK', 'FM', 'FO', 'CK', 'CI', 'CH', 'CO', 'CN', 'CM', 'CL', 'CC', 'CA', 'CG', 'CF', 'CD', 'CZ', 'CY', 'CX', 'CR', 'CW', 'CV', 'CU', 'SZ', 'SY', 'SX', 'SS', 'SR', 'SV', 'ST', 'SK', 'SJ', 'SI', 'SH', 'SO', 'SN', 'SM', 'SL', 'SC', 'SB', 'SA', 'SG', 'SE', 'SD', 'YE', 'YT', 'LB', 'LC', 'LA', 'LK', 'LI', 'LV', 'LT', 'LU', 'LR', 'LS', 'LY', 'VA', 'VC', 'VE', 'VG', 'IQ', 'VI', 'IS', 'IR', 'IT', 'VN', 'IM', 'IL', 'IO', 'IN', 'IE', 'ID', 'BD', 'BE', 'BF', 'BG', 'BA', 'BB', 'BL', 'BM', 'BN', 'BO', 'BH', 'BI', 'BJ', 'BT', 'BV', 'BW', 'BQ', 'BR', 'BS', 'BY', 'BZ', 'RU', 'RW', 'RS', 'RE', 'RO', 'OM', 'HR', 'HT', 'HU', 'HK', 'HN', 'HM', 'EH', 'EE', 'EG', 'EC', 'ET', 'ES', 'ER', 'UY', 'UZ', 'US', 'UM', 'UG', 'UA', 'VU', 'NI', 'NL', 'NO', 'NA', 'NC', 'NE', 'NF', 'NG', 'NZ', 'NP', 'NR', 'NU', 'XK', 'XZ', 'XX', 'KG', 'KE', 'KI', 'KH', 'KN', 'KM', 'KR', 'KP', 'KW', 'KZ', 'KY', 'DO', 'DM', 'DJ', 'DK', 'DE', 'DZ', 'TZ', 'TV', 'TW', 'TT', 'TR', 'TN', 'TO', 'TL', 'TM', 'TJ', 'TK', 'TH', 'TF', 'TG', 'TD', 'TC', 'AE', 'AD', 'AG', 'AF', 'AI', 'AM', 'AL', 'AO', 'AN', 'AQ', 'AS', 'AR', 'AU', 'AT', 'AW', 'AX', 'AZ', 'QA']).optional(),
    default_comment_sort: z.enum(['confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live']).optional(),
    domain_details: z.boolean().optional(),
    email_chat_request: z.boolean().optional(),
    email_comment_reply: z.boolean().optional(),
    email_community_discovery: z.boolean().optional(),
    email_digests: z.boolean().optional(),
    email_messages: z.boolean().optional(),
    email_new_user_welcome: z.boolean().optional(),
    email_post_reply: z.boolean().optional(),
    email_private_message: z.boolean().optional(),
    email_unsubscribe_all: z.boolean().optional(),
    email_upvote_comment: z.boolean().optional(),
    email_upvote_post: z.boolean().optional(),
    email_user_new_follower: z.boolean().optional(),
    email_username_mention: z.boolean().optional(),
    enable_default_themes: z.boolean().optional(),
    enable_followers: z.boolean().optional(),
    enable_reddit_pro_analytics_emails: z.boolean().optional(),
    feed_recommendations_enabled: z.boolean().optional(),
    g: z.enum(['GLOBAL', 'US', 'AR', 'AU', 'BG', 'CA', 'CL', 'CO', 'HR', 'CZ', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IN', 'IE', 'IT', 'JP', 'MY', 'MX', 'NZ', 'PH', 'PL', 'PT', 'PR', 'RO', 'RS', 'SG', 'ES', 'SE', 'TW', 'TH', 'TR', 'GB', 'US_WA', 'US_DE', 'US_DC', 'US_WI', 'US_WV', 'US_HI', 'US_FL', 'US_WY', 'US_NH', 'US_NJ', 'US_NM', 'US_TX', 'US_LA', 'US_NC', 'US_ND', 'US_NE', 'US_TN', 'US_NY', 'US_PA', 'US_CA', 'US_NV', 'US_VA', 'US_CO', 'US_AK', 'US_AL', 'US_AR', 'US_VT', 'US_IL', 'US_GA', 'US_IN', 'US_IA', 'US_OK', 'US_AZ', 'US_ID', 'US_CT', 'US_ME', 'US_MD', 'US_MA', 'US_OH', 'US_UT', 'US_MO', 'US_MN', 'US_MI', 'US_RI', 'US_KS', 'US_MT', 'US_MS', 'US_SC', 'US_KY', 'US_OR', 'US_SD']).optional(),
    hide_ads: z.boolean().optional(),
    hide_downs: z.boolean().optional(),
    hide_from_robots: z.boolean().optional(),
    hide_ups: z.boolean().optional(),
    highlight_controversial: z.boolean().optional(),
    highlight_new_comments: z.boolean().optional(),
    ignore_suggested_sort: z.boolean().optional(),
    in_redesign_beta: z.boolean().optional(),
    label_nsfw: z.boolean().optional(),
    lang: z.string().optional(),
    legacy_search: z.boolean().optional(),
    live_bar_recommendations_enabled: z.boolean().optional(),
    live_orangereds: z.boolean().optional(),
    mark_messages_read: z.boolean().optional(),
    media: z.enum(['on', 'off', 'subreddit']).optional(),
    media_preview: z.enum(['on', 'off', 'subreddit']).optional(),
    min_comment_score: z.number().int().min(-100).max(100).optional(),
    min_link_score: z.number().int().min(-100).max(100).optional(),
    monitor_mentions: z.boolean().optional(),
    newwindow: z.boolean().optional(),
    nightmode: z.boolean().optional(),
    no_profanity: z.boolean().optional(),
    num_comments: z.number().int().min(1).max(500).optional(),
    numsites: z.number().int().min(1).max(100).optional(),
    over_18: z.boolean().optional(),
    private_feeds: z.boolean().optional(),
    profile_opt_out: z.boolean().optional(),
    public_votes: z.boolean().optional(),
    research: z.boolean().optional(),
    search_include_over_18: z.boolean().optional(),
    send_crosspost_messages: z.boolean().optional(),
    send_welcome_messages: z.boolean().optional(),
    show_flair: z.boolean().optional(),
    show_gold_expiration: z.boolean().optional(),
    show_link_flair: z.boolean().optional(),
    show_location_based_recommendations: z.boolean().optional(),
    show_presence: z.boolean().optional(),
    show_stylesheets: z.boolean().optional(),
    show_trending: z.boolean().optional(),
    show_twitter: z.boolean().optional(),
    sms_notifications_enabled: z.boolean().optional(),
    store_visits: z.boolean().optional(),
    survey_last_seen_time: z.number().int().optional(),
    theme_selector: z.string().optional(),
    third_party_data_personalized_ads: z.boolean().optional(),
    third_party_personalized_ads: z.boolean().optional(),
    third_party_site_data_personalized_ads: z.boolean().optional(),
    third_party_site_data_personalized_content: z.boolean().optional(),
    threaded_messages: z.boolean().optional(),
    threaded_modmail: z.boolean().optional(),
    top_karma_subreddits: z.boolean().optional(),
    use_global_defaults: z.boolean().optional(),
    video_autoplay: z.boolean().optional(),
    whatsapp_comment_reply: z.boolean().optional(),
    whatsapp_enabled: z.boolean().optional(),
}).describe('Schema for updating user preferences.');

export const relationshipSchema = z.object({
  name: z.string().describe('The username.'),
  id: z.string().describe("The user's fullname."),
  rel_id: z.string().optional().describe('The relation ID (for friends).'),
  date: z.number().describe('A UTC timestamp of when the relationship was created.'),
});

export const relationshipListingSchema = z.object({
    kind: z.literal('UserList'),
    data: z.object({
        children: z.array(relationshipSchema),
    })
});

export const userThingSchema = z.object({
  kind: z.literal('t2'),
  data: z.lazy(() => require('./index').userSchema),
});

export const userListingSchema = z.object({
    kind: z.literal('Listing'),
    data: z.object({
        after: z.string().nullable(),
        before: z.string().nullable(),
        dist: z.number().nullable(),
        modhash: z.string(),
        geo_filter: z.string().nullable(),
        children: z.array(userThingSchema),
    })
});

export const addFriendSchema = z.object({
  note: z.string().optional(),
}); 